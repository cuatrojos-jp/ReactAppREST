namespace ReactAppREST.Server.Models.Dtos
{
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
