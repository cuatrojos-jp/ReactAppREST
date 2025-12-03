using System;
using System.Collections.Generic;

namespace ReactAppREST.Server.Models;

public partial class Usuario
{
    public int UsuarioId { get; set; }

    public string UsuarioPw { get; set; } = null!;

    public string? UsuarioNombre { get; set; }
}
