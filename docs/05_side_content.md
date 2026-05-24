# 05 — Side Content, Easter Egg e Personalizzazioni

Documento di riferimento per i contenuti opzionali del manoscritto (Fase 2 del sito) e gli indizi nascosti durante la main quest.

-----

## Filosofia

Il side content è **il regalo che continua dopo la giornata**. Mentre la main quest è un’esperienza condivisa col gruppo, il manoscritto è un dialogo più intimo tra il sito e lo sposo, da scoprire con calma nelle settimane successive.

```
MAIN QUEST                  →    "Abbiamo vissuto una cosa insieme"
SIDE CONTENT (manoscritto)  →    "C'è di più. Ed è per te."
EASTER EGGS RISOLTI         →    "Eri davvero attento, eh?"
```

Il manoscritto deve far provare allo sposo **tre sensazioni**:

1. **Sorpresa** — non si aspettava un secondo livello
1. **Riconoscimento** — vede sé stesso e il gruppo nel materiale
1. **Affetto** — capisce quanto cura è stata messa nel regalo

-----

## ★ MATERIALE RACCOLTO — Profilo del gruppo

### Lo sposo

```
Nome:            Mirco
Soprannome:      Cirpo
Passioni:        Videogiochi anni 90, Monkey Island, pupazzetti, manga, lego
Conoscenza VE:   Profonda (è il Lettore Eletto — canonico nel lore)
Tratto iconico:  Ha sempre fretta di tornare a casa
Frase del gruppo che lo definisce: "Tosi me porteo casa"
Note narrative:  Il contrasto tra "uno che vuol sempre andare a casa"
                 e "uno che finalmente trova una casa da cui non vuole
                 più andare via" è il cuore della battuta di Fra Celestino
                 all'Ancora 7.
Dettaglio luogo: Ha VISSUTO a Campo San Giacomo dell'Orio per 2 anni
                 (insieme a Zuppo/Filippo). USO: Ancora 2. Il Lettore
                 Eletto risolve l'enigma anche grazie alla MEMORIA del
                 luogo, non solo alla conoscenza di Venezia. In main
                 quest resta deniable ("ti che qua ti ghe sì stà");
                 esplode nell'extended cut ("la casa no xe un posto,
                 xe chi te speta drento" → lega al tema matrimonio).
```

**Bozza battuta Fra Celestino — Ancora 7:**

> *“Ciò, mòneghi — mi, in vita mia, tosi a casa no ne gò portà. El nostro Cirpo invece sì, e par sempre. Ostrega.”*

**Finale del gioco (DEFINITO):** l'Ancora 7 (Fondamenta della Misericordia, bàcaro **Il Paradiso Perduto**) è l'ultima tappa. Al `/finale` i sette frammenti compongono **VENEZIA**; parte il monologo d'addio che chiude il tema *"Tosi me porteo casa"*; **non c'è cena** — il gioco manda tutti a casa (ritorno verso Stazione S. Lucia). Monologo, extended cut e dedica a Julia in `ancora_7.md`.

### La sposa

```
Nome:            Julia
Citazione Fra Celestino (placeholder — da affinare):
  "Julia, che co' la vede, capisce tuto."
Dettaglio luogo: Cirpo ha CONOSCIUTO Julia a Campo Santa
                 Margherita. USO: Ancora 3 (cuore emotivo
                 del gioco). In main quest deniable ("certi
                 incontri te cambia 'na vita"); esplode
                 nell'extended cut ("qua ti gà incontrà ela").
                 NON esplicitare Julia davanti al gruppo.
Note:            Citata con affetto nella dedica finale.
                 Pochi tratti specifici raccolti —
                 aggiornare se disponibile prima dell'evento.
```

### Il gruppo

```
NOME       SOPRANNOME   RUOLO ARCHETIPICO              NOTE PER FRA CELESTINO
─────────────────────────────────────────────────────────────────────────────
Filippo    Zuppo        L'organizzatore / il DM         Chi ha costruito il gioco
                                                         (rompe la quarta parete
                                                          solo nel side content)
                                                         Ha vissuto a San Giacomo
                                                          dell'Orio con Cirpo (2 anni)
Michele    Mick         Il costruttore / l'artigiano    Affinità con Fra Celestino
                                                         (entrambi fanno cose con
                                                          le mani)
Carlo      Tarch        Il lento (comico involontario)  Fra Celestino lo chiama
                                                         "el pì savio de tuti —
                                                          perché chi va piano..."
Nicola     Bobo         Il silenzioso                   "Quel che tase, sa."
Roberto    Vendra       Il polemico                     Fra Celestino simpatizza:
                                                         "anche mi ero polemico
                                                          col Consiglio dei Dieci"
Luca       Varta        Quello che non si scarica mai   Gag con l'inventario del
                                                         gioco (batteria sempre vuota)
Alessio    Turpe        Il professore                   Dialogo con l'Archivista
                                                         (due accademici)
Mirco      Cirpo        Il Lettore Eletto / lo sposo    (vedi sopra)
```

**Totale gruppo:** 8 persone

### Storia condivisa

```
Evento epico:    Sziget Festival (Budapest, Ungheria)
                 Evento musicale, ci sono stati tutti diverse volte.
                 Fra Celestino "vede nel manoscritto" un campo di tende
                 sulle rive del Danubio — lo cita con invidia senile
                 nell'extended cut di una delle ancore.

Altre storie:    Da raccogliere dopo l'evento per il diario fotografico.
```

### Inside joke

```
1. "Tosi me porteo casa" — frase iconica di Mirco
   USO: battuta/momento di tenerezza all'Ancora 7

2. "Nel Cristo" — Mick (vedi Inside Joke Engine)
   USO: battesimo all'Ancora 1

3. Antipatia per i francesi — inside joke di gruppo
   USO: Ancora 2 (San Giacomo dell'Orio). Si salda al fatto
   storico reale: furono i francesi a scalpellare i leoni
   marciani nel 1797. Aggancio deniable in main quest
   ("gente che parla col naso"), esplode nell'extended cut.

4-5: Da raccogliere prima dell'evento.
     Formato utile: scrivi liberamente, anche in modo grezzo,
     ci lavoriamo insieme per integrarli negli script.
```

-----

## Struttura del manoscritto (Fase 2)

```
/manoscritto                  HUB CENTRALE
├── /capitolo/[1-7]           Manoscritto integrale per ancora
├── /bestiario                Personaggi del mondo di gioco
├── /glossario                Veneziano-italiano
├── /diario                   Foto + ricordi della giornata
├── /segreti                  Easter egg, ottava ancora
└── /extra                    Audio extended cut, behind the scenes
```

### Hub /manoscritto — design

Estetica: copertina di un manuale di gioco anni 90. Disegno principale al centro (Fra Celestino in versione “art ufficiale”), titolo grande, sezioni a icone cliccabili come capitoli di un manuale.

```
╔═══════════════════════════════════════════════╗
║                                               ║
║         LE SETTE ÀNCORE                       ║
║         DELLA SERENISSIMA                     ║
║                                               ║
║         ─ il manoscritto completo ─           ║
║                                               ║
║                                               ║
║         [Illustrazione Fra Celestino          ║
║          stile manuale, grande]               ║
║                                               ║
║                                               ║
║   ▣ I capitoli       ▣ Il bestiario           ║
║   ▣ Il glossario     ▣ Il diario              ║
║   ▣ I segreti        ▣ Extra                  ║
║                                               ║
╚═══════════════════════════════════════════════╝
```

-----

## Capitoli del manoscritto

Per ogni ancora, una pagina “manoscritto integrale” con:

```
CONTENUTO PER OGNI CAPITOLO
───────────────────────────

1. AUDIO EXTENDED CUT (60-180 sec)
   La versione lunga del frammento di Fra Celestino:
   - Tutto quello che il frate avrebbe voluto dire
   - Divagazioni, aneddoti, ricordi personali
   - Più sboccato, più ridanciano
   - Possibili interventi del confratello Fra Bortolo

2. TESTO COMPLETO
   - Frammento veneziano integrale
   - Traduzione italiana completa dell'Archivista
   - Note dell'Archivista (commenti, imbarazzi, contesto)

3. STORIA VERA vs STORIA INVENTATA
   - Cosa esiste davvero nel luogo (storia documentata)
   - Cosa è inventato per il gioco
   - Curiosità storiche autentiche

4. MAPPA DETTAGLIATA DEL LUOGO
   - Illustrazione stilizzata del luogo
   - Punti di interesse del giorno
   - Eventuale foto del gruppo lì

5. IL TUO RICORDO (se inserito)
   - Foto del gruppo in quel punto
   - Inside joke ambientato lì
   - Citazione di qualcuno del gruppo
```

### Capitolo I — La Soglia (Scalzi) — DEFINITO

```
AUDIO EXTENDED CUT (~120 sec) — TESTO DEFINITIVO
─────────────────────────────────────────────────
"Mòneghi mii, sentì qua... Mi son rivà a Venezia tanti
ani fa, zóvene, da Torcello, co' i pie bagnài e 'na fame
da lovo. E sto logo — la soglia — jera el primo respiro
de pietra dopo l'acqua. [sospiro]

Ogni pelegrin che rivava da tera ferma, qua se fermava.
Se segnava. E alzava i oci. Perché lassù, in cima a tuto,
gh'è el Cristo — el brazzo levà, che varda zo. Mi me
vardava propio mi, capì? Mi che gera za 'na testa calda,
co' la ciuca de la sera prima ancora adosso. [risatina]
E el me diséva, mudo: 'Celestino, ti pol entrar, ma mi
te vedo.'

...e sto Cristo in cima, fioi, el me vardava de brutto.
A proposito de chi vien a baterte a la porta co' le bone
intenzioni: gh'è uno tra de vu — el Mick, sì, el nostro
costrutor — che i santoni de strada no'i molava mai.
'Vien con noi, vien con noi.' E lu, ogni volta: 'ndè via,
ndè via!' Ma quei, gnente: te saludava e te augurava de
'ndar nel Cristo. Ostrega, che benedission! [ride] Beh,
mòneghi: mi, da frate, ve digo che 'ndar nel Cristo el xe
el meio augurio che ve possa far. Andèghe tuti, fioi.

Ma scoltème ben, perché stavolta no schèrzo. La soglia
no xe sol pietra. Xe el momento che ti decidi de entrar
— e che qualcun, da l'alto, te varda entrar. El nostro
Cirpo — sì, parlo de ti, novizo — ti gà sempre 'vudo
fretta de tornar a casa. 'Tosi, me porteo casa', ti
disévi sempre. Beh: adesso ti entri in 'na soglia nova,
el matrimonio, da cui no se torna indrio. E pa' 'na
volta, no ti scampi. Bon. Varda el Cristo in cima, fái
un cenno, e entra come se deve: co' la testa alta e el
cuor pien. Andè, fioi."

CONTESTO STORICO REALE
──────────────────────
- La Chiesa degli Scalzi (Santa Maria di Nazareth) fu
  costruita a partire dalla metà del XVII sec. su progetto
  di Baldassarre Longhena; la facciata è di Giuseppe Sardi
  (1672-1680), finanziata dal nobile Gerolamo Cavazza.
- È l'unica facciata in marmo di Carrara di Venezia.
- Fu consacrata nel 1705. Nel 1915 una bomba austriaca
  distrusse il grande affresco di Tiepolo sul soffitto.
- ANACRONISMO VOLUTO: Fra Celestino (XIII sec.) parla di
  una chiesa barocca del XVII sec. È coerente con la
  finzione: il manoscritto è "riemerso" e il frate ne
  parla come di un luogo-soglia atemporale. Da non
  sottolineare nel gioco; se notato, è parte del mistero.
- Fra Celestino è inventato; la fama "rilassata" del clero
  veneziano medievale è storicamente accurata.

IL VOSTRO RICORDO (placeholder)
───────────────────────────────
[FOTO: gruppo davanti alla facciata bianca, appena
 sbarcati dal treno]
Caption: "L'inizio di tutto, ore ~11:00"
Inside joke: "nel Cristo" — il battesimo del gioco
```

### Capitolo II — La Fonte Cancellata (San Giacomo dell'Orio) — DEFINITO

```
AUDIO EXTENDED CUT (~150 sec) — TESTO DEFINITIVO
─────────────────────────────────────────────────
"Eh, San Giacomo dall'Orio... 'sto campo, fioi, el xe
vecio come Venezia stessa — un dei primi posti dove la
zente gà messo radici sù 'sta laguna. E el campanìl in
coto, là, el varda zo da otocent'ani. [sospiro]

Ve gò fato cercar el leon che no gh'è più. Ben: quel leon
lo gà scalpelà i fransesi, quando la Serenissima xe
cascàda, nel '97. Mile sète e novantasète. Rivà Napoleon,
e via i leoni da tute le piere — come se cavàr el segno
bastasse a cavar l'anima de 'na sità. Mona lu. E da alora,
fioi, ogni volta che vedè un sercio vodo dove gera un leon,
podè ringrassiar lori. I fransesi. [sbuffo] Capìo perché
certe antipatie le xe sante? El vostro grupo gà razon da
vender.

El sercio resta. El fantasma resta. E mi, fioi, de
sparizioni me ne intendo: el Consilio dei Diexe gà fato
sparir mi istesso, e el me manoscrito — scalpelài via da
la storia, come quel povaro leon. Ma varda 'desso: vu sè
qua a lezerme. No i gà vinto.

[risatina] Ah, e 'na roba — el nostro Cirpo. Ti credi che
no sàpia, novizo? 'Sto campo qua ti lo conossi mejo de mi.
Ti ghe à vissùo — do ani, no? — co' i pie su 'ste piere
ogni santo zorno. Ti che ti gavevi sempre fretta de tornar
a casa: beh, qua, par un toco, casa tóa la jera propio
'sto campo. Tienlo a mente, novizo, quando varderai la
tosa che ti spóse: la casa no xe un posto. Xe chi te speta
drento. Bon — andè a bever, che ve gò fato vegnir sé.
Verso Santa Margherita, fioi — el campo dei incontri."

CONTESTO STORICO REALE
──────────────────────
- Campo San Giacomo dell'Orio è uno dei campi più antichi
  di Venezia, raccolto attorno a un campanile duecentesco
  in cotto e alle absidi di una chiesa di antichissima
  fondazione (X secolo).
- Prima dell'acquedotto (1884), Venezia beveva esclusiva-
  mente acqua piovana filtrata nelle cisterne sotto i
  campi; la vera da pozzo era la "bocca" della cisterna.
- Sulla vera verso Calle de Mezo c'era un tondo con il
  Leone di San Marco, oggi scalpellato: resta solo il
  cerchio vuoto.
- I leoni marciani furono scalpellati dopo la caduta della
  Repubblica (1797), durante l'occupazione francese. Fatto
  storico reale che si salda all'inside joke "francesi".
- Fra Celestino è inventato; la cancellazione dei leoni e
  la storia idrica dei pozzi sono storicamente accurate.

IL VOSTRO RICORDO (placeholder)
───────────────────────────────
[FOTO: gruppo attorno alla vera da pozzo scalpellata]
Caption: "Il campo di Cirpo, ore ~11:30"
Inside joke: i francesi (il leone tolto) + Cirpo e Zuppo
  che hanno vissuto qui due anni
```

### Capitolo III — L'Incontro (Santa Margherita) — DEFINITO

```
AUDIO EXTENDED CUT (~150 sec) — TESTO DEFINITIVO
─────────────────────────────────────────────────
[È il payoff emotivo della sorpresa: Cirpo lo ascolta
 da solo, a casa, e capisce che il gruppo sapeva. Cameo
 di Fra Bortolo + rivelazione del legame con Julia.]

"Ah, Santa Margherita... [risatina] Mòneghi mii, lassème
contar. Da zóvene, mi e Fra Bortolo — che el Signor lo
gàbia in gloria, anca se no se lo merita — vegnévimo qua
ogni sera. Lu el diséva: 'Celestino, xe studio dei moti
celesti.' E mi: 'Bortolo, i unici corpi celesti che ti
studi i gà do gambe e 'na cuffia.' [ride] Eh, jera altri
tempi.

Ma scoltè, perché 'sto campo no xe un campo qualunque.
Santa Margherita — quela de la lastra — la xe stà ingiotìa
intiera dal drago, e la xe sortìa fora viva, sana, senza
un graffio. Capì la metafora, fioi? Gh'è di chi entra
dentro 'na bestia granda — l'amor, el matrimonio,
ciamàdelo come volè — e par che el sia la fin. E invece
se ghe esce fora pì vivi de prima. [sospiro]

E adesso parlo a ti, novizo. Sì, propio a ti, Cirpo. Ti
credi che no sàpia? In sto campo qua ti ghe à messo i pie
tante de quele volte... ma 'na sera in particolar, qua,
ti gà incontrà ela. La tosa che 'desso ti spóse. Mi te
vardavo da soto le piere, fioi, e gò pensà: varda 'sto
mona che gà sempre fretta de tornar a casa — e no'l sa
gnancora che la casa la xe propio quela tosa lì davanti.
[risatina commossa]

La santa esce viva da la bestia, Cirpo. E ti, da scapolo,
ti esci sposo — e ti esci mejo. Ostrega, varda che roba
che te gò dito. Bortolo, dame da bever che me sgiónfo.
Andè, fioi — godève sto campo. El xe sacro, ma de un sacro
che sa de spritz e de prima volta."

CONTESTO STORICO REALE
──────────────────────
- Campo Santa Margherita (Dorsoduro) è uno dei campi più
  ampi e vivi di Venezia, storicamente popolare e mercantile,
  oggi cuore della vita serale e studentesca.
- La casa bassa isolata al centro del campo era la sede
  della Scuola dei Varoteri (corporazione dei conciatori di
  pelli/pellicciai); porta una lastra scolpita con Santa
  Margherita.
- Santa Margherita di Antiochia: secondo la leggenda fu
  inghiottita da un drago e ne uscì illesa — iconografia
  classica della santa col drago.
- Il campanile della chiesa di Santa Margherita è mozzato
  (troncato): elemento riconoscibile del campo. (Piano B
  dell'enigma, vedi ancora_3.md.)
- Fra Celestino è inventato; la Scuola dei Varoteri e
  l'agiografia di Santa Margherita sono storicamente reali.

IL VOSTRO RICORDO (placeholder)
───────────────────────────────
[FOTO: gruppo col primo spritz nel campo;
 + foto speciale di Cirpo nel punto dell'incontro]
Caption: "Il primo spritz, ore ~12:00 — e dove tutto è iniziato"
Inside joke: qui Cirpo ha conosciuto Julia (rivelato
  nell'extended cut, sorpresa per lo sposo)
```

### Capitolo IV — Le Zattere (secondo spritz, alticcia)

```
TESTO ESTESO DI FRA CELESTINO
─────────────────────────────
[L'audio breve della main quest è ~24 sec (la sosta è lunga,
 ~30 min seduti, ma l'audio-enigma resta corto). L'extended cut dura ~2 min.
 Fra Celestino, alticcio per il secondo spritz, racconta:]

- L'episodio con Fra Bortolo e una scommessa persa al gioco
  delle bocce (NON le tose — quelle sono ora a S.Margherita)
- Una sera ubriaco con un pescatore di Burano
- Riflessione seria sulla marea che divide la città in due
  (lo Sziget NON è più qui — spostato all'Ancora 6, dove il
   tema "perdita del conto delle ore" calza meglio)
- Battuta finale sullo sposo (con riferimento a Cirpo)

CONTESTO STORICO REALE
──────────────────────
- Le Zattere prendono nome dalle "zattere" di legname
  che arrivavano dalla Cadore via fiume
- Sono state per secoli la fondamenta commerciale di Venezia
- Il Gesuati e gli Incurabili sono chiese storiche
- Fra Celestino è inventato MA i monaci a Murano
  effettivamente avevano fama scandalosa nel '200

IL VOSTRO RICORDO (placeholder)
───────────────────────────────
[FOTO: gruppo affacciato sull'acqua, la Giudecca di fronte]
Caption: "Il secondo spritz sull'acqua, ore ~13:00"
(Inside joke Sziget spostato all'Ancora 6 / "L'ora ciuca")
```

### Capitolo V — Il Passaggio (Ponte dell'Accademia) — DEFINITO

```
AUDIO EXTENDED CUT (~130 sec) — TESTO DEFINITIVO
─────────────────────────────────────────────────
[Tappa drammatica/breve in main quest (~20 sec). L'extended
 cut è il payoff su TARCH IL LENTO + la storia vera del ponte.
 Registro: riflessivo-affettuoso, NON alticcio.]

"Ah, el ponte de legno... [sospiro] Fioi, lassème dir 'na
roba. Sto ponte el jera nato par star qua 'na stagion — do,
al massimo. 'Na roba de passagio, 'na pareta provisoria, in
atesa de qualcosa de pì degno, de pì de piera. E invece? Xe
passà i ani, xe passà el fero, xe passà chi gavéa prèssa — e
lu, el legno ùmile, el xe ancora qua. Lo gà rifà, asse par
asse, ma no i lo gà mai cavà. [risatina]

Ostrega, capì la lession? A Venezia — e mi de Venezia me ne
intendo — no reze sempre quel che par fato par durar. Reze
quel che no gà fissa de andar via. Quel che no gà prèssa.

E qua, fioi, parlo de uno de vu. El Tarch. Sì, parlo de ti,
che ti rivi sempre par ultimo, che el grupo el te speta in
cao a ogni cale. I altri i ride: 'el Tarch, el Tarch, sempre
indrio.' Ma scoltème: in sto ponte gh'è 'na doga sola, ciara,
messa par ultima, ani dopo le altre — e quela lì la reze de
pì de tute. Perché la xe rivà co' calma, ben piantà, sensa
fretta. El Tarch el xe quela doga lì. Chi va pian, va san, e
va lontan. El rivarà dopo de tuti — ma el rivarà, e el
resterà. [sospiro affettuoso]

E ti, novizo? Ti gà sempre 'vudo prèssa de tornar a casa.
Beh: stavolta no scampar. Sto passagio qua — el matrimonio —
el par provisorio a chi gà paura, ma el xe la roba che reze
de pì, se ti lo lassi posàr ben. Bortolo el ghe diséva: 'tut
quel che dura, prima el par che no podarà durar.' El gavéa
razon, el mona, par 'na volta. Andè, fioi — passè el ponte,
ma sensa córer."

[Possibile cameo Fra Bortolo, coda nasale:
 "Mi son rivà tardi anca al me funeral, fra."]

CONTESTO STORICO REALE
──────────────────────
- Il Ponte dell'Accademia è uno dei quattro ponti sul Canal
  Grande ed è l'unico in legno.
- L'attuale ponte in legno fu costruito nel 1933 (ing.
  Eugenio Miozzi) come struttura PROVVISORIA, in sostituzione
  del ponte in ferro austriaco del 1854 ritenuto inadatto.
  Doveva essere temporaneo: non fu mai sostituito.
- È stato più volte restaurato e ricostruito fedelmente
  (notevole intervento negli anni '80), mantenendo l'aspetto
  in legno: "il provvisorio diventato eterno".
- ANACRONISMO VOLUTO: Fra Celestino (XIII sec.) parla di un
  ponte del XX sec. Coerente con la finzione: il manoscritto
  è "riemerso" e il frate parla del legno / del passaggio
  come essenza atemporale. Non sottolineare le date in gioco;
  vivono solo qui e nella nota dell'Archivista.
- Fra Celestino è inventato; la storia del ponte provvisorio
  e delle sue ricostruzioni è storicamente accurata.

IL VOSTRO RICORDO (placeholder)
───────────────────────────────
[FOTO: gruppo in mezzo al ponte di legno, il Canal Grande
 alle spalle; + eventuale foto di Tarch che arriva per ultimo]
Caption: "Il passaggio, ore ~14:15 — e Tarch che ci raggiunge"
Inside joke: Tarch il lento (l'asse messa per ultima è quella
  che regge di più)
```

### Capitolo VI — Il Cuore (Rialto · orologio di San Giacometto) — DEFINITO

```
AUDIO EXTENDED CUT (~140 sec) — TESTO DEFINITIVO
─────────────────────────────────────────────────
[Tappa sociale + 🍸 CICCHETTI #2 in main quest (~22 sec). 
 L'extended cut è il payoff su SZIGET + cameo Varta + la
 storia vera dell'orologio. Registro: ALTICCIO, picco di
 allegria della giornata, ma con la malinconia tenera del
 frate sul finale. Fonte testo: ancora_6.md § 9.]

"Eh, Rialto... [risatina] Mòneghi mii, lassème star un atimo
qua, col bicer in man. Sto orologio, vedè, el xe del
Quattrocento, co' 'na lancetta sola a forma de razzo de sol.
E el conta a la veneziana: el zorno intiero, da un tramonto a
l'altro, vintiquatro ore in t'un giro solo — no come 'desso
che spacè tuto in metà. Eh, ma 'l xe sempre stà 'mbriago, sto
orologio: nissun mercante se ghe fidava, i ascoltava le
campane, mìa lu. [ride]

Ma scoltème, perché mi 'sto razzo de sol che gira lento
lento... el me ricorda 'na roba che gò visto nel manoscritto.
Un campo de tende, su 'na riva de un gran fiume, lontan de
qua. E là gh'era anca vui, fioi — sì, vui! E gavè perso el
conto de le ore istesso de 'sto orologio mato. Né zorno né
note: solo musica, ombre e amici. Ostrega, che invidia che
gò, vecio frate che son. [sospiro]

E ti, Varta — sì, propio ti col telefono sempre morto — ti
gèri l'unico col tempo giusto: zero. Batarìa a tera, come
l'orologio. Forse ti gèri el pì venezian de tuti, che no te
interessava che ora che jera. [risatina]

El professor, intanto — quel che me tradùs, l'Archivista — el
sa benissimo de 'sta storia de le ore. Anca massa ben, par
mi. A volte me par che el sia qua tra de vui... ma no digo
altro. [colpo di tosse furbo]

Andè, fioi. A Rialto se conta tuto: i schei, l'oro, le ore.
Ma gh'è 'na roba che no se conta e no se pesa — e xe propio
quela che ve gò portà a trovar tuto el zorno. Dame n'altra
ombra, Bortolo, va'."

[Possibile cameo Fra Bortolo, coda nasale:
 "Vintiquatro ore, fra, e ti te ghe n'à bevudo par quaranta."]

CONTESTO STORICO REALE
──────────────────────
- San Giacomo di Rialto (San Giacometto) è, per tradizione, la
  chiesa più antica di Venezia (consacrazione leggendaria il 25
  marzo 421; prime attestazioni documentate XI-XII sec.).
- Sulla facciata, orologio monumentale: costruito nel 1410, con
  il "razzo d'oro" delle ore completato nel 1422 (maestro Polo
  Pugliese) e rifatto nel 1749. Quadrante diviso in 24 ore in
  cifre romane, segna l'ora "all'italiana" (giornata contata dal
  tramonto), con un'unica lancetta a forma di raggio di sole e
  un leone marciano al centro.
- Serviva a regolare gli orari di apertura e chiusura del
  vicinissimo mercato di Rialto.
- È celebre da secoli per la sua INAFFIDABILITÀ: segna spesso
  l'ora sbagliata; i mercanti si fidavano delle campane, non di
  lui. Da qui la battuta "sempre 'mbriago come mi".
- La chiesa fu sede della Scuola degli Oresi (orafi), col
  Sotoportego dei Oresi accanto: il "numero, il peso, l'oro".
- ANACRONISMO VOLUTO: Fra Celestino (XIII sec.) parla di un
  orologio del XV sec. Coerente con la finzione del manoscritto
  "riemerso" — il tempo del mercato come essenza atemporale. Le
  date vivono solo qui, non in main quest.
- Fra Celestino è inventato; l'orologio e la sua storia sono
  storicamente accurati.

IL VOSTRO RICORDO (placeholder)
───────────────────────────────
[FOTO: gruppo in Campo San Giacometto coi cicchetti e le
 ombre in mano, l'orologio a 24 ore in alto sullo sfondo;
 + eventuale foto di Varta col telefono morto in mano]
Caption: "Il cuore, ore ~16:00 — e nessuno sapeva davvero
  che ora fosse"
Inside joke: Sziget (il campo di tende sul gran fiume dove si
  è perso il conto delle ore, come l'orologio matto) + Varta
  (batteria a terra come l'orologio: il più veneziano di tutti)
Sblocco bonus: easter egg "L'ora ciuca" (INDIZIO 0quinquies)
```

-----

## Bestiario — schede personaggio

Stile manuale Lucasarts anni 90: ritratto pixel art, statistiche fittizie, bio narrativa.

### Personaggi del mondo di gioco

```
1. FRA CELESTINO DA TORCELLO
   Ruolo: protagonista, narratore
   Origine: Torcello, 1228-1297

   Statistiche fittizie:
   - Saggezza: 89/100
   - Resistenza al vino: 99/100
   - Conoscenza di Venezia: 100/100
   - Capacità di stare zitto: 12/100
   - Affetto per lo sposo: ∞

   Citazione famosa:
   "Mi gò vissudo dò vite — una de scienza
    e una de osterìa. No me ne pentisso de nissuna."

2. L'ARCHIVISTA
   Ruolo: narratore secondario, traduttore involontario
   Origine: ignota, "i nostri giorni"

   Statistiche:
   - Pazienza: inizio 95/100 → fine 23/100
   - Imbarazzo: inizio 0/100 → fine 87/100
   - Rigore accademico: 99/100
   - Senso dell'umorismo: 8/100

   Citazione:
   "Trascrivo letteralmente. Non commento."

3. FRA BORTOLO (cameo, side content)
   Ruolo: confratello di Celestino, complice nelle scappatelle
   Origine: Murano, 1235-1289

   Statistiche:
   - Devozione monastica: 4/100
   - Scuse creative: 100/100
   - "Studio dei movimenti celesti": specialista

   Citazione:
   "Xe per studio, fra. Tuto per studio."
```

### Personaggi del gruppo — schede

```
CIRPO (Mirco) — IL LETTORE ELETTO
   Ruolo nel gioco: l'unico che può leggere davvero il manoscritto
   Statistiche:
   - Conoscenza di Venezia: 97/100
   - Fretta di tornare a casa: 100/100
   - Resistenza agli enigmi: alta
   - Resistenza al matrimonio: 0/100 (con gioia)
   Citazione: "Tosi me porteo casa."
   Fra Celestino su di lui: "El Cirpo — tuta la vita co'
     el piè sul uscio. E finalmente gà trovà 'na casa
     da cui no vol più andar via."
   Lore segreto: ha vissuto a Campo San Giacomo dell'Orio
     per due anni (con Zuppo). È per questo che all'Ancora 2
     "sa" dov'è il leone scalpellato: non lo studia, lo
     ricorda. Il campo è stato, per un po', casa sua.

ZUPPO (Filippo) — IL DEMIURGO
   Ruolo nel gioco: l'architetto segreto del manoscritto
   [Rompe la quarta parete SOLO qui, nel side content]
   Statistiche:
   - Piani elaborati: 100/100
   - Piani eseguiti: ~70/100
   - Ore di sonno durante la costruzione del gioco: 4/notte
   Citazione: [da aggiungere — inside joke del gruppo]
   Lore segreto: ha vissuto a San Giacomo dell'Orio con Cirpo.
     Il campo dell'Ancora 2 è anche casa sua.

MICK (Michele) — IL COSTRUTTORE
   Statistiche:
   - Manualità: 98/100
   - Affinità con Fra Celestino: alta
     (entrambi costruiscono cose con le mani)
   - Resistenza ai predicatori porta-a-porta: 100/100
   - Numero di "andè via" pronunciati in vita: ∞
   Fra Celestino: "El Mick e mi: do artigiani, do teste
     dure, do che no se lassa converter da nissun."
   Citazione: "Andè via!" (rivolto a chiunque suoni
     alla porta con buone intenzioni)
   Lore segreto: è grazie a lui che il gruppo si augura
     di "andar nel Cristo". I Testimoni di Geova, respinti
     ogni volta, lo salutavano augurandogli di andare
     "nel Cristo". Da lì l'espressione è diventata il
     tormentone dissacrante-affettuoso del gruppo.
     Fra Celestino approva con entusiasmo.

TARCH (Carlo) — IL SAGGIO LENTO
   Statistiche:
   - Velocità: 12/100
   - Saggezza (secondo Fra Celestino): 94/100
   Fra Celestino: "Chi va piano, va sano e va lontano.
     El Tarch arriverà dopo de tuti — ma arriverà."
   Citazione: [da aggiungere]
   Lore segreto: collegato all'easter egg "La doga del Tarch"
     (Ancora 5, Ponte dell'Accademia). È l'asse di legno messa
     per ultima sul ponte provvisorio: arrivata dopo tutte le
     altre, ma quella che regge di più. Il ponte "provvisorio
     che è diventato eterno" è il suo emblema.

BOBO (Nicola) — IL SILENZIOSO
   Statistiche:
   - Parole per giornata: ~40
   - Peso di ogni parola: 100/100
   Fra Celestino: "Quel che tase, sa."
   Citazione: [da aggiungere]

VENDRA (Roberto) — IL POLEMICO
   Statistiche:
   - Obiezioni per ora: 12
   - Obiezioni fondate: 11
   Fra Celestino: "Anche mi ero polemico col Consiglio
     dei Dieci. Gavevo razon mi."
   Citazione: [da aggiungere]
   Lore segreto: collegato all'easter egg "El lion scondùo"
     (Ancora 2) e all'Indizio 4 "El Consilio dei Diexe" —
     chi ha denunciato Fra Celestino? "Era lui, ovviamente."

VARTA (Luca) — LA BATTERIA SCARICA
   Statistiche:
   - Livello batteria medio: 3%
   - Numero di volte che ha chiesto il caricabatterie: ∞
   Gag con il gioco: l'inventario mostra sempre
     una batteria con una tacca rossa
   Citazione: [da aggiungere]

TURPE (Alessio) — IL PROFESSORE
   Statistiche:
   - Citazioni accademiche a pasto: 7
   - Compatibilità con l'Archivista: 99/100
   Gag: l'Archivista e Turpe sono la stessa persona?
        Il mistero non viene risolto.
   Citazione: [da aggiungere]
```

**Note:** Le citazioni dei membri del gruppo e gli inside joke sono placeholder. Da completare con materiale reale fornito prima dell’evento.

-----

## Glossario veneziano-italiano

Una pagina sfogliabile con tutti i termini veneziani usati nel gioco.

```
CATEGORIE
─────────
- Persone (mòneghi, fioi, tosa, novizo, mona)
- Geografia (calle, campo, fondamenta, sotoportego, bricola)
- Acqua (marea, riva, laguna, squero)
- Architettura (vera da pozzo, bocca de leon)
- Esclamazioni (ciò, ostrega, varda)
- Vita d'osteria (vin, ciuca, osterìa, spritz)
```

**Voci speciali (inside joke del gruppo):**

```
NEL CRISTO (andar ~)
   Augurio/maledizione di significato dibattuto.
   Origine documentata: predicatori itineranti (Testimoni
   di Geova) respinti da un certo costruttore (Mick), che
   lo salutavano augurandogli di "andar nel Cristo".
   Uso nel gruppo: affettuosamente blasfemo.
   Nota dell'Archivista: "Continuo a non capire.
     Ho rinunciato a capire."

FRANSESI (i ~)
   Coloro che, nel 1797, scalpellarono i leoni marciani
   dalle pietre di Venezia. Responsabili del "sercio vodo"
   sulla vera da pozzo di San Giacomo dell'Orio.
   Uso nel gruppo: bersaglio di un'antipatia antica e
   affettuosa.
   Nota dell'Archivista: "Una rivalità che pare trascendere
     i secoli. Non commento."
```

Bonus: ogni termine ha un piccolo audio del Fra Celestino che lo pronuncia (microclip 2-3 sec).

-----

## Diario fotografico

La sezione che si compone **dopo** l’evento, con le foto del giorno.

```
STRUTTURA
─────────
Layout cronologico, una sezione per ancora.
Per ogni ancora:
- 2-4 foto del gruppo in quel luogo
- Caption scritte a mano (font Caveat)
- Eventuale citazione del gruppo registrata
- Mini-mappa del punto preciso

STILE
─────
- Cornici polaroid leggermente ruotate
- Sovrapposizioni asimmetriche
- Note manoscritte tra le foto
- Macchie d'inchiostro, scarabocchi
- Stile "diario di viaggio anni 90"
```

### Note per la giornata

```
□ Almeno 3-4 foto per ogni ancora
□ Una foto "iconica" da usare come copertina
□ Eventuali audio (un membro del gruppo registra
   reazioni o citazioni divertenti)
□ Note mentali su momenti chiave
  — chi ha sbagliato l'enigma più ovvio
  — chi ha trovato un easter egg
  — citazioni memorabili
□ Una foto di gruppo finale
□ Monitorare Varta: documentare ogni richiesta
  di caricabatterie (è materiale per il diario)
□ Foto speciale all'Ancora 2: Cirpo (e Zuppo) davanti
  al campo dove hanno vissuto
```

-----

## Easter Egg & Side Quest

### Meccanica nel main quest

Durante la main quest, 4-6 indizi opzionali sono nascosti. Trovarli sblocca contenuti speciali nel manoscritto.

### Catalogo degli indizi

```
INDIZIO 0: "EL CRISTO CHE VARDA" (Ancora 1 — la soglia)
─────────────────────────────────────────────────────
Trigger: lo sprite del Cristo in cima alla facciata
         degli Scalzi (scena pixel art Ancora 1) è
         tappabile, NON evidenziato. È la stessa figura
         che il gruppo identifica per risolvere l'enigma.
Dove: vertice del frontone nella scena pixel art.
Sblocca (Fase 2): segmento extended cut dell'episodio
         "nel Cristo" (Mick e i Testimoni di Geova)
         + entry glossario "nel Cristo"
         + collegamento alla scheda bestiario di Mick.
         Payoff personalizzato sul gruppo.

INDIZIO 0bis: "EL LION SCONDÙO" (Ancora 2 — la fonte)
─────────────────────────────────────────────────────
Trigger: nella scena pixel art dell'Ancora 2, il TONDO
         VUOTO sulla vera da pozzo (dove il leone è stato
         scalpellato) è tappabile, NON evidenziato. È lo
         stesso dettaglio che il gruppo identifica per
         risolvere l'enigma.
Dove: il medaglione circolare svuotato sulla vera.
Sblocca (Fase 2): storia vera dei leoni marciani scalpellati
         dai francesi post-1797 + entry glossario "fransesi"
         + collegamento alla scheda bestiario di Vendra.
NOTA DESIGN: tematicamente vicino all'Indizio 4 (Consiglio
         dei Dieci). Tenuti distinti — questo è "tappabile
         su schermo", l'Indizio 4 richiede di fotografare
         una bocca di leone reale in città — ma collegati
         nel payoff del side content (filo "cancellazione/
         sparizione/denuncia").

INDIZIO 0ter: "EL DRAGO DE LA SANTA" (Ancora 3 — l'incontro)
─────────────────────────────────────────────────────
Trigger: nella scena pixel art dell'Ancora 3 (Santa
         Margherita), il DRAGO sulla lastra dei Varoteri
         è tappabile, NON evidenziato. È lo stesso
         dettaglio che il gruppo osserva per l'enigma.
Dove: la creatura/drago scolpito sulla lastra della casa
      bassa al centro del campo.
Sblocca (Fase 2): segmento extended cut con la RIVELAZIONE
         del legame Cirpo + Julia (qui si sono conosciuti)
         + storia vera Scuola dei Varoteri e leggenda di
         Santa Margherita + collegamento alla dedica finale
         a Julia.
NOTA DESIGN: è l'easter egg più carico emotivamente del
         gioco. Chi lo trova sblocca il cuore del regalo.

INDIZIO 0quater: "LA DOGA DEL TARCH" (Ancora 5 — il passaggio)
─────────────────────────────────────────────────────
Trigger: nella scena pixel art dell'Ancora 5 (Ponte
         dell'Accademia), una doga del corrimano in legno
         con un NODO ben visibile nel legno (il parapetto è
         in legno pieno: sopralluogo confermato, NESSUNA
         asse rappezzata), è tappabile, NON evidenziata.
         Eco dell'audio: "el xe ancora qua, che no'l gà mai
         'vudo prèssa de cascàr".
Dove: sul corrimano in legno, lato Dorsoduro, una doga con
      un nodo evidente.
Sblocca (Fase 2): segmento extended cut con l'aggancio
         esplicito a TARCH IL LENTO (il ponte intero
         "doveva durar 'na stagion e l'è ancora qua", come
         il nodo che ha tenuto cent'anni; "chi va piano va
         sano e va lontano") + storia vera del ponte
         provvisorio del 1933 (nato temporaneo, mai
         sostituito) + collegamento alla scheda bestiario
         di Tarch.
NOTA DESIGN: stessa meccanica della serie 0/0bis/0ter
         (sprite tappabile sul dettaglio stesso
         dell'enigma). È l'aggancio che mappa finalmente
         l'inside joke "Tarch il lento" a un'ancora.

INDIZIO 0quinquies: "L'ORA CIUCA" (Ancora 6 — il cuore)
─────────────────────────────────────────────────────
Trigger: nella scena pixel art dell'Ancora 6 (Rialto,
         Campo San Giacometto), il QUADRANTE dell'orologio
         a 24 ore sulla facciata della chiesa è tappabile,
         NON evidenziato. È lo stesso dettaglio che il
         gruppo osserva per l'enigma. Eco dell'audio:
         "l'orologio xe sempre 'mbriago come mi".
Dove: il grande orologio monumentale (lancetta unica a
      raggio di sole) in alto sulla facciata.
Sblocca (Fase 2): segmento extended cut con il riferimento
         allo SZIGET (Fra Celestino "vede nel manoscritto"
         un campo di tende su un gran fiume dove il gruppo
         ha "perso il conto delle ore" come il suo orologio
         ubriaco — invidia senile) + storia vera
         dell'orologio del 1410/1422 di San Giacometto
         (ora all'italiana, inaffidabilità leggendaria)
         + cameo Varta ("batteria a terra come l'orologio:
         forse il più veneziano di tutti") + entry glossario
         "ciuca" e "ombra".
NOTA DESIGN: stessa meccanica della serie 0/0bis/0ter/0quater
         (sprite tappabile sul dettaglio stesso dell'enigma).
         È l'aggancio che mappa finalmente lo SZIGET a
         un'ancora (vedi Inside Joke Engine, punto 6).

INDIZIO 0sexies: "VIETATO ORMEGGIARE" (Ancora 7 — la rivelazione)
─────────────────────────────────────────────────────
Trigger: nella scena pixel art dell'Ancora 7 (Fondamenta
         della Misericordia), la targhetta "VIETATO
         ORMEGGIARE" accanto alla bricola sul bordo acqua
         è tappabile, NON evidenziata. Eco dell'audio:
         "varda ben l'insegna".
Dove: la targa + il palo d'ormeggio (bricola) in primo
      piano, davanti al bàcaro Il Paradiso Perduto.
Sblocca (Fase 2): segmento extended cut sul GIOCO àncora <->
         ormeggio ("de tute le àncore, ghe n'è una sola che
         no se tien: quela del scapolo") + OMAGGIO ai Pitura
         Freska in chiave Fra Celestino (SENZA citarne i versi)
         + dedica esplicita a Julia + entry glossario
         "ormeggiare", "bricola", "ostarìa".
NOTA DESIGN: chiude la serie per-ancora (0/0bis/.../0quinquies).
         È anche l'indizio che, insieme agli altri, completa
         il set e sblocca EL OTAVO SEGNO (achievement
         "TOSI ME PORTEO CASA").

INDIZIO 1: "LA BRICCOLA DELLE TRE TACCHE"
─────────────────────────────────────────
Trigger: Fra Celestino in Ancora 4 (Zattere)
         "se uno de vu xe attento, vedrà na
          bricola col tre tacche. Ma no'l ve digo de pì."
Dove: scena pixel art dell'Ancora 4 (Zattere), una briccola
      con un dettaglio diverso dalle altre
Sblocca: storia extra sulle briccole veneziane
         + gag su Varta e la batteria scarica
           (le tacche sulla briccola = barre della batteria)

INDIZIO 2: "EL VIN PERDUTO"
───────────────────────────
Trigger: sprite di Fra Celestino con bottiglia
         (tappabile, non evidenziato)
Sblocca: "ricetta segreta" dello spritz di Fra Celestino
         + storia di una sbornia storica al monastero
         (NB: lo Sziget NON è più qui — payoff consolidato
          su INDIZIO 0quinquies / Ancora 6)

INDIZIO 3: "EL NOME DEA TOSA"
─────────────────────────────
Trigger: parola sottolineata nel dialogo (sembra normale)
Sblocca: la lettera d'amore mai inviata di Fra Celestino
         a una "tosa de Murano" — testo lungo e divertente
         + dedica finale a Julia

INDIZIO 4: "EL CONSILIO DEI DIECI"
──────────────────────────────────
Trigger: bocca di leone reale, in città, che il gruppo
         deve trovare e fotografare (upload sul sito)
Sblocca: versione "secret cut" della morte di Fra Celestino
         — chi l'ha denunciato? (con cameo satirico di Vendra
           il polemico: "era lui, ovviamente")

INDIZIO 5: "EL OTAVO SEGNO"
───────────────────────────
Trigger: sbloccato solo dopo aver trovato tutti gli altri
Sblocca: mini-quest aggiuntiva a casa, porta a easter egg
         finale personalizzato su Cirpo
         — forse: un "achievement" stile videogioco
           "TOSI ME PORTEO CASA — completato"

INDIZIO 6: LIBERO (personalizzazione gruppo — da definire)
──────────────────────────────────────────────────
Lo Sziget — che prima viveva qui come riserva — è stato
collocato sull'INDIZIO 0quinquies (Ancora 6, "L'ora ciuca"):
fit tematico migliore (perdita del conto delle ore + seconda
sosta alcolica). Questo slot resta LIBERO per un futuro
inside joke o aneddoto del gruppo, da costruire quando ne
arrivano altri.
(NB: l'aggancio dell'Ancora 7 vive ora sull'INDIZIO 0sexies,
"vietato ormeggiare". Questo slot 6 resta libero.)
```

### Tipologie di ricompense

```
LIVELLO 1 — TROVATO 1-2 INDIZI
- Sblocca /segreti con curiosità extra
- Sblocca audio bonus di Fra Bortolo

LIVELLO 2 — TROVATO 3-4 INDIZI
- Tutto il livello 1
- + scheda segreta nel bestiario
- + extended cut della scomparsa di Celestino

LIVELLO 3 — TROVATI TUTTI
- Tutto
- + OTTAVA ANCORA: mini-quest finale
  con achievement "TOSI ME PORTEO CASA"
- + dediche personali dal gruppo
- + credits finali in stile videogioco
  con scrolling e musica
```

-----

## Inside Joke Engine

```
CONFERMATI
──────────
1. "Tosi me porteo casa" — Mirco/Cirpo
   → Ancora 7, momento di tenerezza finale
   → Achievement dell'ottava ancora
   → Scheda bestiario di Cirpo

2. "Nel Cristo" — Mick (Michele)
   Origine: i Testimoni di Geova, respinti ripetutamente
     da Mick, lo salutavano augurandogli di andare "nel
     Cristo". Il gruppo (per niente cristiano) ha adottato
     l'espressione come augurio/sfottò dissacrante-affettuoso.
   → Ancora 1: aggancio DENIABLE nella main quest
     (Fra Celestino: "la risposta la trovè nel Cristo")
     + Archivista ignaro ("non vedo cosa ci sia da ridere")
   → Side content: segmento extended cut con l'episodio
     di Mick + entry glossario + scheda bestiario Mick
   → Sbloccato dall'easter egg "El Cristo che varda" (Ancora 1)
   NOTA DESIGN: usare UNA volta sola nella main quest
     (battesimo all'Ancora 1). Non ripetere.

2bis. Antipatia per i francesi — gruppo
   Origine: antipatia storica del gruppo verso i francesi.
   Aggancio reale: i francesi scalpellarono i leoni di San
     Marco dalle pietre di Venezia dopo la caduta della
     Repubblica (1797). La vera da pozzo di San Giacomo
     dell'Orio porta ancora il "sercio vodo" del leone tolto.
   → Ancora 2: aggancio DENIABLE nella main quest
     (Fra Celestino: "gente che parla col naso") + Archivista
     ignaro ("Presumo una fazione storica rivale").
   → Extended cut Ancora 2: Fra Celestino esplicita i francesi
     e benedice l'antipatia del gruppo ("certe antipatie le xe
     sante").
   → Side content: entry glossario "fransesi".
   → Sbloccato dall'easter egg "El lion scondùo" (Ancora 2).
   NOTA DESIGN: usare con misura. Battuta una volta in main
     quest, payoff nel side content.

3. Varta e la batteria scarica
   → Gag ricorrente nell'inventario del gioco
     (slot batteria sempre a 3%)
   → Sbloccato dall'Indizio 1 (le tacche sulla briccola)
   → Caption nel diario fotografico

4. Tarch il lento
   → Ancora 5 (Ponte dell'Accademia): aggancio DENIABLE in
     main quest (Fra Celestino: "el xe ancora qua, che no'l
     gà mai 'vudo prèssa de cascàr" → il ponte provvisorio-
     ma-eterno = la cosa lenta che dura). NON nominare Tarch
     in main quest.
   → Metafora veicolante: l'asse di legno messa per ultima è
     quella che regge di più. "Chi va piano va sano e va
     lontano": arriva dopo tutti, ma arriva e resta.
   → Extended cut Ancora 5: payoff esplicito su Tarch
     (Fra Celestino lo difende, come da suo tema ricorrente).
   → Sbloccato dall'easter egg "La doga del Tarch"
     (INDIZIO 0quater, Ancora 5).
   → Fra Celestino lo difende ogni volta; "Chi va piano" è
     il suo tema ricorrente (vedi scheda bestiario Tarch).
   NOTA DESIGN: deniable in main quest, payoff nel side
     content — stesso schema degli altri agganci personali.

5. Turpe + l'Archivista
   → Sono la stessa persona? Il gioco non lo dice mai.
   → Nel bestiario, le schede si somigliano troppo.

6. Sziget Festival
   → Fra Celestino lo cita nell'extended cut dell'Ancora 6
     (Rialto): l'orologio a 24 ore "sempre 'mbriago" gli
     ricorda un campo di tende su un gran fiume dove il
     gruppo ha "perso il conto delle ore" — né giorno né
     notte, solo musica, ombre e amici.
   → "Anche vui gavè vissudo su un'isola. Capì cosa vol dir."
   → Sbloccato dall'easter egg "L'ora ciuca"
     (INDIZIO 0quinquies, Ancora 6).
   → Aggancio cameo: Varta ("batteria a terra come
     l'orologio: forse il più veneziano di tutti").
   NOTA SHIFT: prima era assegnato all'extended cut dell'Ancora
     4 (Zattere). Spostato a 6 — alle Zattere il secondo spritz
     è breve/in piedi e mal si sposa col tema "perdita del tempo
     + festa", che vuole la sosta lunga (i cicchetti di Rialto).

7. Cirpo (e Zuppo) hanno vissuto a San Giacomo dell'Orio
   → Ancora 2: aggancio DENIABLE ("ti che qua ti ghe sì stà")
   → Extended cut Ancora 2: payoff esplicito + tema "la casa
     no xe un posto, xe chi te speta drento" (lega al matrimonio)
   → Diario fotografico: foto speciale di Cirpo/Zuppo nel campo

8. Cirpo ha conosciuto Julia a Campo Santa Margherita
   Origine: è il campo dove lo sposo ha incontrato la sposa.
     Cuore emotivo dell'intero gioco.
   → Ancora 3: aggancio DENIABLE ("certi incontri te cambia 'na
     vita... ma no digo altro" + "ti che qua ti ghe sì stà").
     NON esplicitare Julia in main quest (spoiler della sorpresa
     + imbarazzo pubblico dello sposo davanti al gruppo).
   → Metafora veicolante: Santa Margherita esce viva dal drago
     = chi entra nel matrimonio ne esce più vivo. Deniable e
     affettuosa, nella voce-da-osteria di Fra Celestino.
   → Extended cut Ancora 3: RIVELAZIONE esplicita ("qua ti gà
     incontrà ela"). È il momento pelle-d'oca del side content:
     Cirpo lo ascolta da solo, a casa, e capisce che sapevate.
   → Sbloccato dall'easter egg "El drago de la santa" (Ancora 3).
   → Specchio generazionale: Fra Celestino guardava le tose in
     questo stesso campo (ricordo "tose" spostato qui da Zattere).
   → Eco col finale: prepara Ancora 7 ("chi te speta drento").
   NOTA DESIGN: l'inside joke più delicato del gioco. Tutto in
     main quest resta velato; il payoff è nel post-evento.

DA RACCOGLIERE
──────────────
- 3-4 citazioni/frasi iconiche dei membri del gruppo
- 1-2 aneddoti specifici (viaggi, serate, eventi)
- Eventuali soprannomi secondari
- Cosa ha detto Vendra di polemico più memorabile
- L'ultima cosa che ha detto Bobo (il silenzioso)
  prima di questo addio al celibato
```

-----

## Audio Extended Cut

```
DURATA      │ 60-180 secondi (vs 15-25 della main quest)
CONTENUTO   │ - L'audio della main quest INCLUSO
            │ - + divagazioni e aneddoti
            │ - + interventi possibili di Fra Bortolo
            │ - + battute più sboccate
            │ - + riferimenti personalizzati al gruppo:
            │     Cirpo, Varta, Tarch, Vendra, Bobo, Mick,
            │     Turpe, Zuppo — ciascuno almeno un cameo
            │ - + riferimento allo Sziget (Ancora 6)
PROD        │ Stesse impostazioni audio della main quest
            │ Possibile seconda voce per Fra Bortolo
```

-----

## Behind the scenes / Extra

```
CONTENUTI
─────────

1. "COME È NATO QUESTO REGALO"
   Nota personale di Zuppo (Filippo) a Cirpo
   [Rompe la quarta parete — solo qui è permesso]

2. "I LUOGHI VERI VS QUELLI INVENTATI"
   Mappa critica storia documentata vs invenzione

3. "LA VOCE DI FRA CELESTINO"
   Nota orgogliosa sulla generazione AI della voce

4. "LE CASE VECCHIE"
   Storia vera delle 12 famiglie fondatrici
   (Fra Celestino confessa di aver manipolato il numero)

5. RINGRAZIAMENTI
   Al gruppo, a Venezia, all'arte delle scappatelle
   clericali medievali

6. CREDITS finali in stile videogioco
   Scrolling con soprannomi del gruppo:
   CIRPO — il Lettore Eletto
   ZUPPO — il Demiurgo
   MICK — le mani che costruiscono
   TARCH — la saggezza lenta
   BOBO — il silenzio che sa
   VENDRA — la polemica giusta
   VARTA — 3% di batteria, 100% di presenza
   TURPE — il professore (o era l'Archivista?)
   JULIA — che co' la vede, capisce tuto
   FRA CELESTINO — riposa in pace, frate
```

-----

## Workflow di raccolta materiale

```
PRIMA DELL'EVENTO          STATO
──────────────────────────────────────────────
□ Profilo sposo            ✓ COMPLETATO
□ Profilo gruppo           ✓ COMPLETATO (soprannomi + ruoli)
□ Inside joke principali   ⚠ PARZIALE (4 confermati: "Tosi me
                             porteo casa" + "nel Cristo" + antipatia
                             francesi + Julia/S.Margherita; altri da
                             raccogliere)
□ Aneddoti memorabili      ⚠ PARZIALE (Sziget confermato; Cirpo/Zuppo
                             a San Giacomo dell'Orio confermato;
                             incontro Cirpo+Julia a S.Margherita confermato)
□ Citazioni gruppo         ✗ DA RACCOGLIERE
□ Tratti di Julia          ✗ DA RACCOGLIERE (opzionale)

DURANTE L'EVENTO
──────────────────────────────────────────────
□ 3-4 foto per ogni ancora
□ Foto iconica per copertina
□ Note su momenti memorabili
□ Documentare le richieste di Varta (caricabatterie)
□ Catturare "la prima cosa che dice Bobo"
□ Foto di Cirpo/Zuppo nel loro vecchio campo (Ancora 2)
□ Foto speciale all'Ancora 3 (S.Margherita): Cirpo nel campo
   dove ha conosciuto Julia — SENZA spoilerargli il perché
□ Foto all'Ancora 5 (Ponte dell'Accademia): il gruppo sul
   ponte di legno + se possibile Tarch che arriva per ultimo
   (materiale per l'easter egg "La doga del Tarch")

DOPO L'EVENTO
──────────────────────────────────────────────
□ Racconto di come è andata
□ Citazione iconica della giornata
□ Foto in alta qualità
□ → Completamento side content e rilascio
```

-----

## Principio guida

**Il main quest è la festa. Il side content è il regalo che resta sul comodino.**

Tutto quello che metti nel side content deve dire allo sposo: *“Ti voglio bene, ti conosco, ti ho ascoltato. Goditi anche questo.”*

Niente forzato, niente ridondante. Ogni inside joke deve essere riconoscibile da chi c’era. Ogni dettaglio storico deve far venire voglia di approfondire. Ogni audio extended deve essere un piccolo dono in più.
