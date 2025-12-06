namespace ReactAppREST.Server.Models
{
    public class PerfilDto
    {
        public int PerfilId { get; set; }
        public string? PerfilNombre { get; set; }
        public bool? PerfilActivo { get; set; }
        public int UsuariosCount { get; set; }
    }
}