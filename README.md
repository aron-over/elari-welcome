# elari-welcome

Welcome screen voor de tv's op kantoor, plus een pagina om gasten in te plannen. Draait volledig op GitHub Pages.

- **Welcome screen (tv's):** https://aron-over.github.io/elari-welcome/
- **Inplannen (pc):** https://aron-over.github.io/elari-welcome/plan.html

De planning staat in `schedule.json`. De plan-pagina schrijft daar via de GitHub API naartoe met een persoonlijke token (eenmalig te koppelen op de pagina, blijft alleen in de browser). Het welcome screen leest het bestand elke 90 seconden. Een wijziging staat dus binnen ongeveer 1,5 minuut op de schermen.

Let op: de repo is publiek, dus ingeplande namen zijn zichtbaar in `schedule.json` en de geschiedenis. Gebruik bij voorkeur alleen voornamen.
