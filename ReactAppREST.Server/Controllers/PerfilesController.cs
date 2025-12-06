using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactAppREST.Server.Models;
using ReactAppREST.Server.Models.Dtos;

namespace ReactAppREST.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("MyAllowSpecificOrigins")]
    public class PerfilesController : ControllerBase
    {
        private readonly SemestrefrontContext _context;

        public PerfilesController(SemestrefrontContext context)
        {
            _context = context;
        }

        // GET: api/Perfiles
        [HttpGet]
        [EnableCors("AllowAllOrigins")]
        public async Task<ActionResult<IEnumerable<PerfilDto>>> GetPerfiles([FromQuery] bool solamenteActivos = false)
        {
            var query = _context.Perfils.AsQueryable();

            if (solamenteActivos)
            {
                query = query.Where(p => p.PerfilActivo == true);
            }

            var perfiles = await query
                .Select(p => new PerfilDto
                {
                    PerfilId = p.PerfilId,
                    PerfilNombre = p.PerfilNombre,
                    PerfilActivo = p.PerfilActivo,
                    UsuariosCount = p.UsuarioPerfils.Count() // Contar usuarios asignados
                })
                .AsNoTracking()
                .ToListAsync();

            return Ok(perfiles);
        }

        // NUEVO ENDPOINT: GET: api/Perfiles/5/usuarios
        [HttpGet("{id}/usuarios")]
        [EnableCors("AllowAllOrigins")]
        public async Task<ActionResult<IEnumerable<UsuarioDto>>> GetUsuariosPorPerfil(int id)
        {
            var perfil = await _context.Perfils.FindAsync(id);
            if (perfil == null)
            {
                return NotFound(new { mensaje = "Perfil no encontrado" });
            }

            var usuarios = await _context.UsuarioPerfils
                .Where(up => up.PerfilId == id)
                .Select(up => up.Usuario)
                .Select(u => new UsuarioDto // Usamos el DTO para no exponer contraseñas
                {
                    UsuarioId = u.UsuarioId,
                    UsuarioNombre = u.UsuarioNombre,
                    UsuarioApPat = u.UsuarioApPat,
                    UsuarioApMat = u.UsuarioApMat,
                    UsuarioActivo = u.UsuarioActivo
                })
                .AsNoTracking()
                .ToListAsync();

            return Ok(usuarios);
        }


        // GET: api/Perfiles/5 (sin cambios)
        [HttpGet("{id}")]
        [EnableCors("AllowAllOrigins")]
        public async Task<ActionResult<Perfil>> GetPerfil(int id)
        {
            var perfil = await _context.Perfils.FindAsync(id);

            if (perfil == null)
            {
                return NotFound(new { mensaje = "Perfil no encontrado" });
            }

            return perfil;
        }

        // POST: api/Perfiles (sin cambios)
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        public async Task<ActionResult<Perfil>> PostPerfil(Perfil perfil)
        {
            _context.Perfils.Add(perfil);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPerfil), new { id = perfil.PerfilId }, perfil);
        }

        // PUT: api/Perfiles/5 (sin cambios)
        [HttpPut("{id}")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> PutPerfil(int id, Perfil perfil)
        {
            if (id != perfil.PerfilId)
            {
                return BadRequest(new { mensaje = "El ID del perfil no coincide" });
            }

            _context.Entry(perfil).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Perfils.Any(e => e.PerfilId == id))
                {
                    return NotFound(new { mensaje = "Perfil no encontrado" });
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Perfiles/5 (sin cambios)
        [HttpDelete("{id}")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> DeletePerfil(int id)
        {
            var perfil = await _context.Perfils.FindAsync(id);
            if (perfil == null)
            {
                return NotFound(new { mensaje = "Perfil no encontrado" });
            }

            _context.Perfils.Remove(perfil);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class PerfilDto
    {
        public int PerfilId { get; set; }
        public string PerfilNombre { get; set; }
        public bool? PerfilActivo { get; set; }
        public int UsuariosCount { get; set; }
    }
}