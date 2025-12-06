using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactAppREST.Server.Models;

namespace ReactAppREST.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("MyAllowSpecificOrigins")]
    public class UsuarioPerfilesController : ControllerBase
    {
        private readonly SemestrefrontContext _context;

        public UsuarioPerfilesController(SemestrefrontContext context)
        {
            _context = context;
        }

        // POST: api/UsuarioPerfiles/asignar
        [HttpPost("asignar")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> AsignarPerfil([FromBody] UsuarioPerfilDto asignacion)
        {
            var usuario = await _context.Usuarios.Include(u => u.UsuarioPerfils).FirstOrDefaultAsync(u => u.UsuarioId == asignacion.UsuarioId);
            if (usuario == null)
            {
                return NotFound(new { mensaje = "Usuario no encontrado" });
            }

            var perfil = await _context.Perfils.FindAsync(asignacion.PerfilId);
            if (perfil == null)
            {
                return NotFound(new { mensaje = "Perfil no encontrado" });
            }

            if (usuario.UsuarioPerfils.Any(p => p.PerfilId == asignacion.PerfilId))
            {
                return Conflict(new { mensaje = "El usuario ya tiene este perfil asignado." });
            }

            usuario.UsuarioPerfils.Add(new UsuarioPerfil { UsuarioId = usuario.UsuarioId, PerfilId = perfil.PerfilId });
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Perfil asignado correctamente." });
        }

        // DELETE: api/UsuarioPerfiles/remover
        [HttpDelete("remover")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> RemoverPerfil([FromBody] UsuarioPerfilDto asignacion)
        {
            var usuario = await _context.Usuarios.Include(u => u.UsuarioPerfils).FirstOrDefaultAsync(u => u.UsuarioId == asignacion.UsuarioId);
            if (usuario == null)
            {
                return NotFound(new { mensaje = "Usuario no encontrado" });
            }

            var perfil = usuario.UsuarioPerfils.FirstOrDefault(p => p.PerfilId == asignacion.PerfilId);
            if (perfil == null)
            {
                return NotFound(new { mensaje = "El usuario no tiene este perfil asignado." });
            }

            usuario.UsuarioPerfils.Remove(perfil);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Perfil removido correctamente." });
        }
    }

    public class UsuarioPerfilDto
    {
        public int UsuarioId { get; set; }
        public int PerfilId { get; set; }
    }
}