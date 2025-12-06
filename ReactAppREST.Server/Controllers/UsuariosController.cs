using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactAppREST.Server.Models;
using System.Security.Cryptography;
using System.Text;

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
        public async Task<ActionResult<IEnumerable<UsuarioDto>>> GetUsuarios()
        {
            var usuarios = await _context.Usuarios
                .Select(u => new UsuarioDto
                {
                    UsuarioId = u.UsuarioId,
                    UsuarioNombre = u.UsuarioNombre,
                    UsuarioApPat = u.UsuarioApPat,
                    UsuarioApMat = u.UsuarioApMat,
                    UsuarioActivo = u.UsuarioActivo,
                    PerfilIds = u.UsuarioPerfils.Select(up => up.PerfilId).ToList()
                })
                .AsNoTracking()
                .ToListAsync();

            return Ok(usuarios);
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        [EnableCors("AllowAllOrigins")]
        public async Task<ActionResult<UsuarioDto>> GetUsuario(int id)
        {
            var usuarioDto = await _context.Usuarios
                .Where(u => u.UsuarioId == id)
                .Select(u => new UsuarioDto
                {
                    UsuarioId = u.UsuarioId,
                    UsuarioNombre = u.UsuarioNombre,
                    UsuarioApPat = u.UsuarioApPat,
                    UsuarioApMat = u.UsuarioApMat,
                    UsuarioActivo = u.UsuarioActivo,
                    PerfilIds = u.UsuarioPerfils.Select(up => up.PerfilId).ToList()
                })
                .FirstOrDefaultAsync();

            if (usuarioDto == null)
                return NotFound(new { mensaje = "Usuario no encontrado" });

            return Ok(usuarioDto);
        }

        // POST: api/Usuarios/login (Sin cambios)
        [HttpPost("login")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null || string.IsNullOrWhiteSpace(loginRequest.UsuarioNombre))
                return BadRequest(new { mensaje = "Datos de login inválidos" });

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.UsuarioNombre == loginRequest.UsuarioNombre);

            var hashedRequestPassword = HashPassword(loginRequest.UsuarioPw);

            if (usuario == null || usuario.UsuarioPw != hashedRequestPassword)
            {
                return Unauthorized(new { mensaje = "Credenciales inválidas" });
            }

            if (usuario.UsuarioActivo != true)
            {
                return Unauthorized(new { mensaje = "El usuario no está activo." });
            }

            return Ok(new { mensaje = "Login exitoso" });
        }

        // POST: api/Usuarios
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        public async Task<ActionResult<UsuarioDto>> PostUsuario(UsuarioCreateDto usuarioDto)
        {
            if (await _context.Usuarios.AnyAsync(u => u.UsuarioNombre == usuarioDto.UsuarioNombre))
            {
                return Conflict(new { mensaje = "El nombre de usuario ya existe." });
            }

            var usuario = new Usuario
            {
                UsuarioNombre = usuarioDto.UsuarioNombre,
                UsuarioApPat = usuarioDto.UsuarioApPat,
                UsuarioApMat = usuarioDto.UsuarioApMat,
                UsuarioPw = HashPassword(usuarioDto.UsuarioPw),
                UsuarioActivo = usuarioDto.UsuarioActivo ?? true
            };

            // Asignar perfiles
            if (usuarioDto.PerfilIds.Any())
            {
                var perfiles = await _context.Perfils.Where(p => usuarioDto.PerfilIds.Contains(p.PerfilId)).ToListAsync();
                foreach (var perfil in perfiles)
                {
                    // La tabla de unión se crea aquí
                    usuario.UsuarioPerfils.Add(new UsuarioPerfil { Perfil = perfil });
                }
            }

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            var usuarioCreadoDto = new UsuarioDto
            {
                UsuarioId = usuario.UsuarioId,
                UsuarioNombre = usuario.UsuarioNombre,
                UsuarioApPat = usuario.UsuarioApPat,
                UsuarioApMat = usuario.UsuarioApMat,
                UsuarioActivo = usuario.UsuarioActivo,
                PerfilIds = usuario.UsuarioPerfils.Select(up => up.PerfilId).ToList()
            };

            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.UsuarioId }, usuarioCreadoDto);
        }

        // PUT: api/Usuarios/5
        [HttpPut("{id}")]
        [EnableCors("AllowAllOrigins")]
        public async Task<IActionResult> PutUsuario(int id, UsuarioUpdateDto usuarioDto)
        {
            var usuarioExistente = await _context.Usuarios
                .Include(u => u.UsuarioPerfils) // Incluir perfiles existentes
                .FirstOrDefaultAsync(u => u.UsuarioId == id);

            if (usuarioExistente == null)
                return NotFound(new { mensaje = "Usuario no encontrado" });

            // Actualizar propiedades del usuario
            usuarioExistente.UsuarioNombre = usuarioDto.UsuarioNombre;
            usuarioExistente.UsuarioApPat = usuarioDto.UsuarioApPat;
            usuarioExistente.UsuarioApMat = usuarioDto.UsuarioApMat;
            usuarioExistente.UsuarioActivo = usuarioDto.UsuarioActivo;

            if (!string.IsNullOrWhiteSpace(usuarioDto.UsuarioPw))
            {
                usuarioExistente.UsuarioPw = HashPassword(usuarioDto.UsuarioPw);
            }

            // Sincronizar perfiles
            var perfilesActualesIds = usuarioExistente.UsuarioPerfils.Select(up => up.PerfilId).ToList();
            var perfilesNuevosIds = usuarioDto.PerfilIds;

            var perfilesParaEliminar = usuarioExistente.UsuarioPerfils
                .Where(up => !perfilesNuevosIds.Contains(up.PerfilId)).ToList();
            _context.UsuarioPerfils.RemoveRange(perfilesParaEliminar);

            var perfilesParaAgregarIds = perfilesNuevosIds.Except(perfilesActualesIds).ToList();
            var perfilesParaAgregar = await _context.Perfils
                .Where(p => perfilesParaAgregarIds.Contains(p.PerfilId)).ToListAsync();
            
            foreach (var perfil in perfilesParaAgregar)
            {
                usuarioExistente.UsuarioPerfils.Add(new UsuarioPerfil { Perfil = perfil });
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Usuarios/5 (Sin cambios)
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

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashedBytes).Replace("-", "").ToLowerInvariant();
        }
    }

    // --- DTOs (Data Transfer Objects) para la API ---
    public class LoginRequest
    {
        public string UsuarioNombre { get; set; } = null!;
        public string UsuarioPw { get; set; } = null!;
    }

    public class UsuarioCreateDto
    {
        public string? UsuarioNombre { get; set; }
        public string? UsuarioApPat { get; set; }
        public string? UsuarioApMat { get; set; }
        public string UsuarioPw { get; set; } = null!;
        public bool? UsuarioActivo { get; set; }
        public List<int> PerfilIds { get; set; } = new List<int>();
    }

    public class UsuarioUpdateDto
    {
        public string? UsuarioNombre { get; set; }
        public string? UsuarioApPat { get; set; }
        public string? UsuarioApMat { get; set; }
        public string? UsuarioPw { get; set; } // Opcional
        public bool? UsuarioActivo { get; set; }
        public List<int> PerfilIds { get; set; } = new List<int>();
    }

    public class UsuarioDto
    {
        public int UsuarioId { get; set; }
        public string? UsuarioNombre { get; set; }
        public string? UsuarioApPat { get; set; }
        public string? UsuarioApMat { get; set; }
        public bool? UsuarioActivo { get; set; }
        public List<int> PerfilIds { get; set; } = new List<int>();
    }
}