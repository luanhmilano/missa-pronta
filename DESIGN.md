---
name: Musicas da Missa Design Spec
colors:
  primary: "#2563eb"
  primary-hover: "#1d4ed8"
  surface: "#ffffff"
  background: "#f8fafc"
  border: "#e2e8f0"
  text-main: "#0f172a"
  text-muted: "#64748b"
  tag-bg: "#eff6ff"
  tag-text: "#1e40af"
  accent-danger: "#ef4444"
typography:
  headline-lg: { fontFamily: Inter, fontSize: 28px, fontWeight: 700, lineHeight: 1.2 }
  headline-md: { fontFamily: Inter, fontSize: 20px, fontWeight: 600, lineHeight: 1.3 }
  body-md: { fontFamily: Inter, fontSize: 15px, fontWeight: 400, lineHeight: 1.5 }
  label-sm: { fontFamily: Inter, fontSize: 13px, fontWeight: 600, lineHeight: 1.4 }
rounded:
  sm: 6px
  md: 8px
  lg: 12px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
components:
  combobox:
    backgroundColor: "{colors.surface}"
    border: "{colors.border}"
    rounded: "{rounded.md}"
---

# Musicas da Missa Design Spec

## Overview
Interface moderna, elegante e acessível para o gerenciamento e montagem de repertórios de missas litúrgicas.

## Colors
- Primary: Azul católico solene (`#2563eb`)
- Surface: Branco / Neutro escuro dependendo do tema (`#ffffff` / `var(--surface-color)`)
- Tag & Accent: Azul suave e destaques para momentos litúrgicos (`var(--tag-bg)`)

## Do's and Don'ts
- Do: Manter feedback tátil e limpo em interações de busca e seleção.
- Don't: Usar elementos genéricos sem suporte a acessibilidade e tema escuro.
