using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactAppREST.Server.Models;

namespace ReactAppREST.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowVercelApp")]
    public class CaGradosController : ControllerBase
    {
        private readonly SemestrefrontContext _context;

        public CaGradosController(SemestrefrontContext context)
        {
            _context = context;
        }

        // GET: api/Grados
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CaGrado>>> GetGrados()
        {
            var grados = await _context.CaGrados
                .AsNoTracking()
                .ToListAsync();

            return Ok(grados);
        }

        // GET: api/Grados/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CaGrado>> GetGrado(int id)
        {
            var grado = await _context.CaGrados
                .Include(g => g.CaAlumnos) // opcional: carga alumnos asociados
                .FirstOrDefaultAsync(g => g.CaGradNId == id);

            if (grado == null)
                return NotFound(new { mensaje = "Grado no encontrado" });

            return Ok(grado);
        }

        // POST: api/Grados
        [HttpPost]
        public async Task<ActionResult<CaGrado>> PostGrado(CaGrado grado)
        {
            if (grado == null)
                return BadRequest(new { mensaje = "Datos de grado inválidos" });

            _context.CaGrados.Add(grado);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGrado), new { id = grado.CaGradNId }, grado);
        }

        // PUT: api/Grados/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGrado(int id, CaGrado grado)
        {
            if (id != grado.CaGradNId)
                return BadRequest(new { mensaje = "El ID del grado no coincide" });

            var gradoExistente = await _context.CaGrados.FindAsync(id);
            if (gradoExistente == null)
                return NotFound(new { mensaje = "Grado no encontrado" });

            // Actualiza solo los campos necesarios
            gradoExistente.CaGradTDescripcion = grado.CaGradTDescripcion;

            _context.Entry(gradoExistente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, new { mensaje = "Error al actualizar el grado" });
            }

            return NoContent();
        }


        // DELETE: api/Grados/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGrado(int id)
        {
            var grado = await _context.CaGrados.FindAsync(id);
            if (grado == null)
                return NotFound(new { mensaje = "Grado no encontrado" });

            _context.CaGrados.Remove(grado);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}