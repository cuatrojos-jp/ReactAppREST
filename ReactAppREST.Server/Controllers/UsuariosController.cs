using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactAppREST.Server.Models;

namespace ReactAppREST.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("MyAllowSpecificOrigins")]
    public class UsuariosController : ControllerBase
    {
        private readonly SemestrefrontContext _context;

        public UsuariosController(SemestrefrontContext context)
        {
            _context = context;
        }

        // GET: api/Usuarios
        [HttpGet]
        [EnableCors("AllowAllOrigins")]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            var usuarios = await _context.Usuarios
                .AsNoTracking()
                .ToListAsync();

            return Ok(usuarios);
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        [EnableCors("AllowAllOrigins")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.UsuarioId == id);

            if (usuario == null)
                return NotFound(new { mensaje = "Usuario no encontrado" });

            return Ok(usuario);
        }

        // POST: api/Usuarios
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        public async Task<ActionResult<Usuario>> PostUsuario([FromBody] Usuario usuario)
        {
            if (usuario == null)
                return BadRequest(new { mensaje = "Datos de usuario inválidos" });

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.UsuarioId }, usuario);
        }

        // POST: api/Usuarios/login
        // Login based on UsuarioNombre + UsuarioPw to match the Usuario model
        [HttpPost("login")]
        [EnableCors("AllowAllOrigins")]
        public async Task<ActionResult<Usuario>> Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null || string.IsNullOrWhiteSpace(loginRequest.UsuarioNombre))
                return BadRequest(new { mensaje = "Datos de login inválidos" });

            var usuario = await _context.Usuarios
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.UsuarioNombre == loginRequest.UsuarioNombre);

            if (usuario == null || usuario.UsuarioPw != loginRequest.UsuarioPw)
                return Unauthorized(new { mensaje = "Credenciales inválidas" });

            return Ok(usuario);
        }

        // PUT: api/Usuarios/5
        [HttpPut("{id}")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> PutUsuario(int id, [FromBody] Usuario usuario)
        {
            if (usuario == null || id != usuario.UsuarioId)
                return BadRequest(new { mensaje = "El ID del usuario no coincide o datos inválidos" });

            var usuarioExistente = await _context.Usuarios.FindAsync(id);
            if (usuarioExistente == null)
                return NotFound(new { mensaje = "Usuario no encontrado" });

            // Update allowed fields (password and name)
            usuarioExistente.UsuarioPw = usuario.UsuarioPw;
            usuarioExistente.UsuarioNombre = usuario.UsuarioNombre;

            _context.Entry(usuarioExistente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, new { mensaje = "Error al actualizar el usuario" });
            }

            return NoContent();
        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{id}")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return NotFound(new { mensaje = "Usuario no encontrado" });

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class LoginRequest
    {
        public string UsuarioNombre { get; set; } = null!;
        public string UsuarioPw { get; set; } = null!;
    }
}