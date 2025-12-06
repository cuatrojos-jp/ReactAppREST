using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ReactAppREST.Server.Models;

public partial class SemestrefrontContext : DbContext
{
    public SemestrefrontContext()
    {
    }

    public SemestrefrontContext(DbContextOptions<SemestrefrontContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CaAlumno> CaAlumnos { get; set; }

    public virtual DbSet<CaGrado> CaGrados { get; set; }

    public virtual DbSet<Perfil> Perfils { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    public virtual DbSet<UsuarioPerfil> UsuarioPerfils { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CaAlumno>(entity =>
        {
            entity.HasKey(e => e.CaAlumNId).HasName("PK__CaAlumno__B1DDA465AF22270D");

            entity.ToTable("CaAlumno");

            entity.Property(e => e.CaAlumNId).HasColumnName("CaALUM_nID");
            entity.Property(e => e.BActivo)
                .HasDefaultValue(true)
                .HasColumnName("bActivo");
            entity.Property(e => e.CaAlumTApellidoMaterno)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("CaALUM_tApellidoMaterno");
            entity.Property(e => e.CaAlumTApellidoPaterno)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("CaALUM_tApellidoPaterno");
            entity.Property(e => e.CaAlumTNombre)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("CaALUM_tNombre");
            entity.Property(e => e.CaAlumTTelefono)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("CaALUM_tTelefono");
            entity.Property(e => e.CaGradNId).HasColumnName("CaGRAD_nID");

            entity.HasOne(d => d.CaGradN).WithMany(p => p.CaAlumnos)
                .HasForeignKey(d => d.CaGradNId)
                .HasConstraintName("FK__CaAlumno__CaGRAD__3A81B327");
        });

        modelBuilder.Entity<CaGrado>(entity =>
        {
            entity.HasKey(e => e.CaGradNId).HasName("PK__CaGrado__C7E986BFBC3779C8");

            entity.ToTable("CaGrado");

            entity.Property(e => e.CaGradNId).HasColumnName("CaGRAD_nID");
            entity.Property(e => e.CaGradTDescripcion)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("CaGRAD_tDescripcion");
        });

        modelBuilder.Entity<Perfil>(entity =>
        {
            entity.HasKey(e => e.PerfilId).HasName("PK__Perfil__0C005B662B9AE9AA");

            entity.ToTable("Perfil");

            entity.Property(e => e.PerfilId).HasColumnName("PerfilID");
            entity.Property(e => e.PerfilNombre)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.UsuarioId).HasName("PK__Usuario__2B3DE79887D41668");

            entity.ToTable("Usuario");

            entity.Property(e => e.UsuarioId).HasColumnName("UsuarioID");
            entity.Property(e => e.UsuarioApMat)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UsuarioApPat)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UsuarioNombre)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UsuarioPw)
                .HasMaxLength(64)
                .IsUnicode(false)
                .HasColumnName("UsuarioPW");
        });

        modelBuilder.Entity<UsuarioPerfil>(entity =>
        {
            entity.HasKey(e => e.UsuarioPerfilId).HasName("PK__UsuarioP__E64528867A9D167D");

            entity.ToTable("UsuarioPerfil");

            entity.HasIndex(e => new { e.UsuarioId, e.PerfilId }, "UQ_UsuarioPerfil").IsUnique();

            entity.Property(e => e.UsuarioPerfilId).HasColumnName("UsuarioPerfilID");
            entity.Property(e => e.PerfilId).HasColumnName("PerfilID");
            entity.Property(e => e.UsuarioId).HasColumnName("UsuarioID");

            entity.HasOne(d => d.Perfil).WithMany(p => p.UsuarioPerfils)
                .HasForeignKey(d => d.PerfilId)
                .HasConstraintName("FK_UsuarioPerfil_Perfil");

            entity.HasOne(d => d.Usuario).WithMany(p => p.UsuarioPerfils)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("FK_UsuarioPerfil_Usuario");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
