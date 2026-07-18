# Destello glitch al entrar en Proyectos

## Objetivo

Sustituir la línea roja fija que atraviesa la pantalla por una interferencia breve vinculada a la entrada de la sección «Proyectos».

## Comportamiento aprobado

- La línea permanece invisible durante el resto de la navegación.
- Se activa una sola vez por carga cuando la sección de proyectos entra aproximadamente en la zona central de la ventana.
- El destello dura alrededor de 200 ms y combina desplazamiento, deformación y desvanecimiento.
- La línea es puramente decorativa, no captura eventos y permanece oculta para tecnologías de asistencia.
- Con `prefers-reduced-motion: reduce`, el destello no se muestra.

## Implementación

`PortfolioPage` conserva una única capa decorativa para la interferencia. El script de efectos observa la sección identificada por `data-motion-section="projects"` mediante `IntersectionObserver`. Al cruzar el umbral, añade un estado de activación a la capa y desconecta el observador para evitar repeticiones.

CSS mantiene la capa invisible por defecto y define una animación corta únicamente para el estado activo. La animación vinculada continuamente al desplazamiento desaparece.

Si faltan la capa o la sección objetivo, el script lanza un error explícito con contexto suficiente para detectar una regresión estructural.

## Verificación

- Prueba de navegador: la línea comienza oculta, se activa al entrar en proyectos y desaparece al finalizar.
- Prueba de navegador: no vuelve a activarse al salir y regresar.
- Prueba de navegador: permanece oculta con movimiento reducido.
- Validación completa existente: contenido, lint, tipos, compilación, Lighthouse y navegación en escritorio y móvil.

## Fuera de alcance

No se modifican el overlay de scanlines, el cursor forense, las animaciones de entrada del contenido ni el diseño de las secciones.
