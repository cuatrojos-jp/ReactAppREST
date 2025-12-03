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

        // GET: api/Alumnos
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

        // GET: api/Alumnos/5
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
        public async Task<ActionResult<CaAlumno>> PostAlumno(CaAlumno alumno)
        {
            if (alumno == null)
                return BadRequest(new { mensaje = "Datos inválidos del alumno" });

            // Si no se especifica, lo marcamos como activo por defecto
            alumno.BActivo ??= true;

            _context.CaAlumnos.Add(alumno);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAlumno), new { id = alumno.CaAlumNId }, alumno);
        }

        // PUT: api/Alumnos/5
        [HttpPut("{id}")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> PutAlumno(int id, CaAlumno alumno)
        {
            if (id != alumno.CaAlumNId)
                return BadRequest(new { mensaje = "El ID del alumno no coincide" });

            var alumnoExistente = await _context.CaAlumnos.FindAsync(id);
            if (alumnoExistente == null)
                return NotFound(new { mensaje = "Alumno no encontrado" });

            alumnoExistente.CaAlumTNombre = alumno.CaAlumTNombre;
            alumnoExistente.CaAlumTApellidoPaterno = alumno.CaAlumTApellidoPaterno;
            alumnoExistente.CaAlumTApellidoMaterno = alumno.CaAlumTApellidoMaterno;
            alumnoExistente.CaAlumTTelefono = alumno.CaAlumTTelefono;
            alumnoExistente.CaGradNId = alumno.CaGradNId;
            alumnoExistente.BActivo = alumno.BActivo;

            _context.Entry(alumnoExistente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, new { mensaje = "Error al actualizar el alumno" });
            }

            return NoContent();
        }

        // DELETE: api/Alumnos/5
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

        // PATCH: api/Alumnos/activar/5
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

        // PATCH: api/Alumnos/desactivar/5
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
        // Simplified bulk: accept an array of CaAlumno directly and insert them as-is (no DTOs/mapping).
        [HttpPost("bulk")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> PostAlumnosBulk([FromBody] List<CaAlumno>? alumnos)
        {
            if (alumnos == null || alumnos.Count == 0)
                return BadRequest(new { mensaje = "No se recibieron datos para insertar." });

            // Ensure default values where appropriate (keep behaviour consistent with single post)
            foreach (var a in alumnos)
            {
                a.BActivo ??= true;
            }

            await using var tx = await _context.Database.BeginTransactionAsync();
            try
            {
                await _context.CaAlumnos.AddRangeAsync(alumnos);
                await _context.SaveChangesAsync();
                await tx.CommitAsync();

                return Ok(new { inserted = alumnos.Count });
            }
            catch (Exception ex)
            {
                await tx.RollbackAsync();
                return StatusCode(500, new { mensaje = "Error al insertar los alumnos", detalle = ex.Message });
            }
        }
    }
}