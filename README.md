# elari-welcome

Welcome screen voor de tv's op kantoor, plus een pagina om gasten in te plannen. Draait op GitHub Pages; de planning staat in een Google Sheet.

- **Welcome screen (tv's):** https://aron-over.github.io/elari-welcome/
- **Inplannen (pc):** https://aron-over.github.io/elari-welcome/plan.html

## Eenmalig instellen

1. Maak een lege Google Sheet (bijvoorbeeld "Elari welcome planning").
2. Kies **Extensies > Apps Script**. Verwijder de voorbeeldcode en plak de inhoud van `google-script/Code.gs`. Sla op.
3. Kies **Implementeren > Nieuwe implementatie**, type **Web-app**.
   - Uitvoeren als: **Ik**
   - Toegang: **Iedereen**
4. Geef toestemming als Google erom vraagt (Geavanceerd > Doorgaan) en kopieer de **web-app URL**.
5. Zet die URL in `config.js` (`SCRIPT_URL`) en push.

Inplannen kan daarna zonder inloggen via de plan-pagina. De Google Sheet toont alle inplanningen en oude regels worden na een dag automatisch opgeruimd.

## Let op

- De repo is publiek en de script-URL staat in `config.js`. Wie die URL kent, kan de planning lezen en aanpassen. Gebruik bij voorkeur alleen voornamen.
- Wijzigen van `Code.gs` in de repo past het Google-script niet vanzelf aan; plak dan opnieuw en kies Implementeren > Implementaties beheren > Nieuwe versie.
