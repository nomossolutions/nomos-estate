Tipografía de Nomos Estate
==========================

Las siguientes familias tipográficas se distribuyen en este proyecto bajo la
SIL Open Font License 1.1 (OFL), que permite su uso, modificación y
redistribución — incluido el auto-alojamiento — siempre que se conserve esta
atribución.

Archivos en este directorio
----------------------------

  jost-400.ttf        Jost Regular
  jost-600.ttf        Jost SemiBold

    Familia:  Jost
    Autor:    indestructible type* (Owen Earl)
    Licencia: SIL Open Font License 1.1
    Origen:   https://fonts.google.com/specimen/Jost

    Uso: display. Titulares, precios, nombres de lámina, wordmarks.

  manrope-400.ttf     Manrope Regular
  manrope-500.ttf     Manrope Medium
  manrope-600.ttf     Manrope SemiBold

    Familia:  Manrope
    Autor:    Mikhail Sharanda
    Licencia: SIL Open Font License 1.1
    Origen:   https://fonts.google.com/specimen/Manrope

    Uso: texto. Párrafos, navegación, formularios, etiquetas y datos.

    El tercer recurso de la escala (`.indicador` / `--font-serial`) no es una
    fuente descargada: usa la pila monoespaciada del sistema, porque numera y
    referencia series en lugar de componer texto de marca.

Por qué están auto-alojadas
----------------------------
`next/font/google` descarga las fuentes en tiempo de build. El entorno de build
de este proyecto no siempre tiene salida a red, así que una descarga en build
rompería el build. Estos archivos se compilan a woff2 y se subsetean en build,
por lo que el formato de entrada (.ttf) no afecta al peso servido.

Texto completo de la licencia
------------------------------
La OFL 1.1 exige incluir la licencia completa junto con las fuentes. Está
disponible en:

  https://openfontlicense.org/open-font-license-official-text/

Resumen de las condiciones relevantes:
  - Se permite usar, estudiar, modificar y redistribuir las fuentes, incluso
    comercialmente y de forma auto-alojada.
  - No se permite vender las fuentes por sí solas.
  - Toda obra derivada debe usar otro nombre de familia y conservar esta
    atribución.
  - Se permite embeber las fuentes en documentos y aplicaciones.
