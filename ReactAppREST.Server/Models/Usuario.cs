using System;
using System.Collections.Generic;

namespace ReactAppREST.Server.Models;

public partial class Usuario
{
    public int UsuarioId { get; set; }

    public string? UsuarioNombre { get; set; }

    public string? UsuarioApPat { get; set; }

    public string? UsuarioApMat { get; set; }

    public string? UsuarioPw { get; set; }

    public bool? UsuarioActivo { get; set; }

    public virtual ICollection<UsuarioPerfil> UsuarioPerfils { get; set; } = new List<UsuarioPerfil>();
}
