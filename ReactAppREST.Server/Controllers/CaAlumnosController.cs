using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ReactAppREST.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;

namespace ReactAppREST.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("MyAllowSpecificOrigins")]
    public class CaAlumnosController : ControllerBase
    {
        private readonly SemestrefrontContext _context;

        public CaAlumnosController(SemestrefrontContext context)
        {
            _context = context;
        }

        // GET: api/Alumnos (Sin cambios)
        [HttpGet]
        [EnableCors("AllowAllOrigins")]
        public async Task<ActionResult<IEnumerable<object>>> GetAlumnos()
        {
            var alumnos = await _context.CaAlumnos
                .Include(a => a.CaGradN)
                .Select(a => new
                {
                    a.CaAlumNId,
                    a.CaAlumTNombre,
                    a.CaAlumTApellidoPaterno,
                    a.CaAlumTApellidoMaterno,
                    a.CaAlumTTelefono,
                    a.CaGradNId,
                    GradoDescripcion = a.CaGradN != null ? a.CaGradN.CaGradTDescripcion : null,
                    a.BActivo
                })
                .AsNoTracking()
                .ToListAsync();

            return Ok(alumnos);
        }

        // GET: api/Alumnos/5 (Sin cambios)
        [HttpGet("{id}")]
        [EnableCors("AllowAllOrigins")]
        public async Task<ActionResult<object>> GetAlumno(int id)
        {
            var alumno = await _context.CaAlumnos
                .Include(a => a.CaGradN)
                .Where(a => a.CaAlumNId == id)
                .Select(a => new
                {
                    a.CaAlumNId,
                    a.CaAlumTNombre,
                    a.CaAlumTApellidoPaterno,
                    a.CaAlumTApellidoMaterno,
                    a.CaAlumTTelefono,
                    a.CaGradNId,
                    GradoDescripcion = a.CaGradN != null ? a.CaGradN.CaGradTDescripcion : null,
                    a.BActivo
                })
                .FirstOrDefaultAsync();

            if (alumno == null)
                return NotFound(new { mensaje = "Alumno no encontrado" });

            return Ok(alumno);
        }

        // POST: api/Alumnos
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        public async Task<ActionResult<CaAlumno>> PostAlumno([FromBody] AlumnoCreateDto alumnoDto)
        {
            if (alumnoDto == null)
                return BadRequest(new { mensaje = "Datos inválidos del alumno" });

            // Convertimos el DTO a la entidad CaAlumno
            var alumno = new CaAlumno
            {
                CaAlumTNombre = alumnoDto.CaAlumTNombre,
                CaAlumTApellidoPaterno = alumnoDto.CaAlumTApellidoPaterno,
                CaAlumTApellidoMaterno = alumnoDto.CaAlumTApellidoMaterno,
                CaAlumTTelefono = alumnoDto.CaAlumTTelefono,
                // Si el ID es 0, se convierte en null. Si es null, se queda como null.
                CaGradNId = (alumnoDto.CaGradNId == 0) ? null : alumnoDto.CaGradNId,
                BActivo = alumnoDto.BActivo ?? true
            };

            if (alumno.CaGradNId.HasValue && !await _context.CaGrados.AnyAsync(g => g.CaGradNId == alumno.CaGradNId.Value))
            {
                return BadRequest(new { mensaje = $"El ID de grado '{alumno.CaGradNId}' no es válido." });
            }

            _context.CaAlumnos.Add(alumno);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAlumno), new { id = alumno.CaAlumNId }, alumno);
        }

        // PUT: api/Alumnos/5
        [HttpPut("{id}")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> PutAlumno(int id, [FromBody] AlumnoUpdateDto alumnoDto)
        {
            var alumnoExistente = await _context.CaAlumnos.FindAsync(id);
            if (alumnoExistente == null)
                return NotFound(new { mensaje = "Alumno no encontrado" });

            var gradNId = (alumnoDto.CaGradNId == 0) ? null : alumnoDto.CaGradNId;

            if (gradNId.HasValue && !await _context.CaGrados.AnyAsync(g => g.CaGradNId == gradNId.Value))
            {
                return BadRequest(new { mensaje = $"El ID de grado '{gradNId}' no es válido." });
            }

            alumnoExistente.CaAlumTNombre = alumnoDto.CaAlumTNombre;
            alumnoExistente.CaAlumTApellidoPaterno = alumnoDto.CaAlumTApellidoPaterno;
            alumnoExistente.CaAlumTApellidoMaterno = alumnoDto.CaAlumTApellidoMaterno;
            alumnoExistente.CaAlumTTelefono = alumnoDto.CaAlumTTelefono;
            alumnoExistente.CaGradNId = gradNId;
            alumnoExistente.BActivo = alumnoDto.BActivo ?? alumnoExistente.BActivo;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Alumnos/5 (Sin cambios)
        [HttpDelete("{id}")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> DeleteAlumno(int id)
        {
            var alumno = await _context.CaAlumnos.FindAsync(id);
            if (alumno == null)
                return NotFound(new { mensaje = "Alumno no encontrado" });

            _context.CaAlumnos.Remove(alumno);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/Alumnos/activar/5 (Sin cambios)
        [HttpPatch("activar/{id}")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> ActivarAlumno(int id)
        {
            var alumno = await _context.CaAlumnos.FindAsync(id);
            if (alumno == null)
                return NotFound(new { mensaje = "Alumno no encontrado" });

            alumno.BActivo = true;
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Alumno activado correctamente" });
        }

        // PATCH: api/Alumnos/desactivar/5 (Sin cambios)
        [HttpPatch("desactivar/{id}")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> DesactivarAlumno(int id)
        {
            var alumno = await _context.CaAlumnos.FindAsync(id);
            if (alumno == null)
                return NotFound(new { mensaje = "Alumno no encontrado" });

            alumno.BActivo = false;
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Alumno desactivado correctamente" });
        }

        // POST: api/Alumnos/bulk
        [HttpPost("bulk")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> PostAlumnosBulk([FromBody] List<AlumnoCreateDto>? alumnosDto)
        {
            if (alumnosDto == null || alumnosDto.Count == 0)
                return BadRequest(new { mensaje = "No se recibieron datos para insertar." });

            var gradosIdsEnviados = alumnosDto
                .Select(a => a.CaGradNId)
                .Where(id => id.HasValue && id != 0)
                .Select(id => id!.Value)
                .Distinct()
                .ToList();

            if (gradosIdsEnviados.Any())
            {
                var gradosExistentes = await _context.CaGrados
                    .Where(g => gradosIdsEnviados.Contains(g.CaGradNId))
                    .Select(g => g.CaGradNId)
                    .ToHashSetAsync();

                var gradosInvalidos = gradosIdsEnviados.Except(gradosExistentes).ToList();
                if (gradosInvalidos.Any())
                {
                    return BadRequest(new { mensaje = $"Los siguientes IDs de grado no son válidos: {string.Join(", ", gradosInvalidos)}" });
                }
            }

            var alumnosParaAgregar = alumnosDto.Select(dto => new CaAlumno
            {
                CaAlumTNombre = dto.CaAlumTNombre,
                CaAlumTApellidoPaterno = dto.CaAlumTApellidoPaterno,
                CaAlumTApellidoMaterno = dto.CaAlumTApellidoMaterno,
                CaAlumTTelefono = dto.CaAlumTTelefono,
                CaGradNId = (dto.CaGradNId == 0) ? null : dto.CaGradNId,
                BActivo = dto.BActivo ?? true
            }).ToList();

            await _context.CaAlumnos.AddRangeAsync(alumnosParaAgregar);
            await _context.SaveChangesAsync();

            return Ok(new { inserted = alumnosParaAgregar.Count });
        }
    }
}
public class AlumnoCreateDto
{
    public string? CaAlumTNombre { get; set; }
    public string? CaAlumTApellidoPaterno { get; set; }
    public string? CaAlumTApellidoMaterno { get; set; }
    public string? CaAlumTTelefono { get; set; }
    public int? CaGradNId { get; set; }
    public bool? BActivo { get; set; }
}

public class AlumnoUpdateDto
{
    public string? CaAlumTNombre { get; set; }
    public string? CaAlumTApellidoPaterno { get; set; }
    public string? CaAlumTApellidoMaterno { get; set; }
    public string? CaAlumTTelefono { get; set; }
    public int? CaGradNId { get; set; }
    public bool? BActivo { get; set; }
}