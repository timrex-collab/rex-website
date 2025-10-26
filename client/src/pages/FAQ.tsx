import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImage from "@assets/tondach_hero.png";

export default function FAQ() {
  const faqCategories = [
    {
      category: "Angebote & Preise",
      questions: [
        {
          question: "Sind Kostenvoranschläge und Angebote bei Ihnen kostenlos und unverbindlich?",
          answer: "Ja – in der Regel ist die Erstellung eines Angebots ist für Sie kostenlos und erfolgt unverbindlich.\nNach einer ausführlichen Begutachtung erhalten Sie von uns ein transparent kalkuliertes Angebot.\n\nBei ausführlichen Berechnungen und Kalkulationsverfahren behalten wir uns vor, eine Pauschale ( richtet sich nach Projektgröße ) zu berechnen, die nach Auftragserteilung verrechnet werden kann."
        },
        {
          question: "Wie läuft die Angebotserstellung ab?",
          answer: "Zunächst vereinbaren wir einen Besichtigungstermin vor Ort, um Ihr Dach und Ihr Vorhaben genau kennenzulernen. Nach dieser Begutachtung planen wir die erforderlichen Arbeiten und erstellen eine detaillierte Kalkulation. In der Regel erhalten Sie innerhalb weniger Tage ihr schriftliches Angebot, in dem alle Leistungen und Kosten klar aufgeführt sind."
        },
        {
          question: "Bleibt der angebotene Preis verbindlich, oder kommen im Nachhinein Mehrkosten?",
          answer: "Unsere Angebote sind sorgfältig kalkuliert. Sollten während der Arbeiten dennoch unvorhergesehene Umstände auftreten, sprechen wir Sie umgehend transparent darauf an und legen gemeinsam fest, wie wir weiter vorgehen. Überraschende Nachträge werden Sie bei uns nicht erleben."
        },
        {
          question: "Wovon hängen die Kosten für ein Dachprojekt ab?",
          answer: "Die Kosten richten sich nach verschiedenen Faktoren des Projekts. Größe und Umfang der Dachfläche, die gewählten Materialien (z.B. Ziegel, Dämmung, Abdichtung) sowie die Zugänglichkeit bzw. der Aufwand spielen eine große Rolle. Auch besondere Anforderungen – etwa Dachgauben, Dachfenster oder aufwendige Details – beeinflussen den Preis. Deshalb erstellen wir immer ein individuelles Angebot, das genau auf Ihre Gegebenheiten zugeschnitten ist."
        },
        {
          question: "Gibt es Fördermöglichkeiten oder Zuschüsse für Dachsanierungen?",
          answer: "Ja, eine Dachsanierung wird über die Bundesförderung für effiziente Gebäude (BEG) gefördert.\n\nDas Bundesamt für Wirtschaft und Ausfuhrkontrolle (BAFA) bietet Zuschüsse für Einzelmaßnahmen (BEG EM):\n\n• Basiszuschuss: 15 % der förderfähigen Kosten (max. 30.000 €)\n• Mit individuellem Sanierungsfahrplan (iSFP): 20 % Zuschuss\n• Förderfähige Kosten verdoppeln sich auf 60.000 € pro Wohneinheit\n• Maximale Förderung: 12.000 € pro Wohneinheit\n\nAlternativ: Sanierung auf Effizienzhaus-Niveau (BEG WG) über die KfW mit zinsvergünstigten Krediten und Tilgungszuschüssen.\n\nWichtig:\n• Technische Mindestanforderungen müssen eingehalten werden (z.B. U-Wert 0,14 für das Dach)\n• Antrag muss vor Beginn der Maßnahme gestellt werden"
        }
      ]
    },
    {
      category: "Steildach",
      questions: [
        {
          question: "Was kostet eine neue Dacheindeckung oder Dachsanierung beim Steildach?",
          answer: "Die Kosten für ein neues Steildach hängen von vielen Faktoren ab – insbesondere von der Dachgröße, der gewählten Eindeckung und eventuellen Dämm-Maßnahmen. Als grobe Orientierung kann man bei einer Neueindeckung mit etwa 80–130 € pro Quadratmeter Dachfläche rechnen; wird zusätzlich eine Wärmedämmung eingebaut, eher 150–250 € pro m², da hier mehr Material und Aufwand nötig sind. Den genauen Preis ermitteln wir jedoch immer durch eine Vor-Ort-Besichtigung und einen detaillierten Kostenvoranschlag, um alle Besonderheiten Ihres Dachs zu berücksichtigen."
        },
        {
          question: "Wie lange dauert eine Dachsanierung bei einem Steildach?",
          answer: "Die Dauer einer Dachsanierung hängt von Umfang und Dachgröße ab. Bei einem typischen Einfamilienhaus können Sie mit rund 3 bis 4 Wochen Arbeitszeit rechnen, wenn es um eine komplette Neueindeckung inklusive Dämmung geht. Müssen zusätzliche Details wie Gauben oder viele Dachfenster berücksichtigt werden, kann es etwas länger dauern – wir planen den Zeitrahmen individuell und sprechen ihn im Voraus mit Ihnen ab."
        },
        {
          question: "Woran erkennt man, dass eine Dachsanierung notwendig ist?",
          answer: "Ein Alter von etwa 30–50 Jahren ist bei vielen Dächern ein Anhaltspunkt, ab dem eine Sanierung empfehlenswert ist. Darüber hinaus geben sichtbare Schäden klare Hinweise: Zum Beispiel beschädigte oder fehlende Ziegel, undichte Stellen (Wasserflecken am Dachboden), morsche Holzteile im Dachstuhl oder spürbare Wärmeverluste trotz Heizung. Solche Anzeichen – oder akute Probleme wie Sturm- oder Feuchtigkeitsschäden – signalisieren Handlungsbedarf. In diesen Fällen sollten Sie einen Fachbetrieb das Dach inspizieren lassen, um weitere Schäden zu vermeiden."
        },
        {
          question: "Welche Materialien verwenden Sie für Steildächer?",
          answer: "Wir verwenden ausschließlich hochwertige Materialien für Ihr Steildach. Klassischerweise kommen Tonziegel oder Betondachsteine zum Einsatz, aber auch Schiefer oder Metallbedachungen sind möglich – je nach Wunsch und Anforderungen. Für Anschlüsse und Sonderbereiche nutzen wir langlebige Metalle wie Zink, Aluminium oder Kupfer. Welches Material für Ihr Dach am besten geeignet ist, besprechen wir natürlich ausführlich mit Ihnen, damit Optik, Haltbarkeit und Preis-Leistung stimmen."
        }
      ]
    },
    {
      category: "Flachdach",
      questions: [
        {
          question: "Was kostet eine Flachdach-Reparatur oder -Sanierung?",
          answer: "Die Kosten bei Flachdacharbeiten sind sehr individuell. Sie hängen vor allem von der Fläche, dem Schadensbild und dem verwendeten Material ab. Kleine Reparaturen (beispielsweise eine undichte Anschlussstelle) lassen sich oft schon für wenige hundert Euro erledigen, während eine umfangreiche Flachdach-Komplettsanierung – je nach Größe des Dachs – in den höherpreisigen Bereich gehen kann. Wir erstellen Ihnen gerne ein maßgeschneidertes Angebot, sobald wir Ihr Flachdach vor Ort begutachtet haben."
        },
        {
          question: "Wie lange hält ein Flachdach im Durchschnitt?",
          answer: "Ein professionell abgedichtetes Flachdach hält je nach verwendeter Abdichtung und Pflege etwa 20 bis 40 Jahre. Wichtig ist eine regelmäßige Wartung: Durch Inspektionen und rechtzeitige Reparaturen kann die Lebensdauer deutlich verlängert werden. Umgekehrt können stehendes Wasser, extreme Witterung oder mangelnde Pflege die Haltbarkeit verkürzen – daher achten wir auf eine einwandfreie Ausführung und bieten auf Wunsch auch Wartungsverträge an."
        },
        {
          question: "Welche typischen Schäden treten bei Flachdächern auf?",
          answer: "Flachdächer können durch Witterung und Alter verschiedene Probleme entwickeln. Häufig sieht man Wasseransammlungen (Pfützenbildung bei unzureichendem Gefälle), Risse oder Undichtigkeiten in der Dachabdichtung sowie Blasenbildung unter Bitumenbahnen. Auch gelöste Nähte, unterläufige Stellen oder beschädigte Dachbahnen kommen vor. Wichtig ist, solche Schäden frühzeitig zu beheben – schon kleine Undichtigkeiten können zu Feuchtigkeitsproblemen in der Bausubstanz führen, wenn sie unbehandelt bleiben."
        },
        {
          question: "Reparieren Sie auch kleine Flachdächer – zum Beispiel Garagen oder Carports?",
          answer: "Ja. Wir kümmern uns sowohl um kleine Flachdächer (Garagen, Carports, Anbauten) als auch um große Flachdachflächen auf Wohnhäusern oder Gewerbebauten. Dabei sind wir mit allen Abdichtungsarten vertraut: Ob Ihr Flachdach mit Bitumenbahnen, Kunststofffolien oder Flüssigkunststoff abgedichtet ist – wir können die passenden Reparaturmethoden anwenden. Selbst kleinste Undichtigkeiten werden von uns sorgfältig abgedichtet, damit Ihr Flachdach wieder dicht und geschützt ist."
        },
        {
          question: "Wie oft sollte ein Flachdach gewartet werden?",
          answer: "Flachdächer benötigen etwas mehr Aufmerksamkeit als Steildächer. Wir empfehlen, mindestens zweimal im Jahr eine Flachdach-Kontrolle und Reinigung durchführen zu lassen – idealerweise einmal im Frühjahr und einmal im Herbst. Durch diese regelmäßige Wartung (Entfernen von Laub, Prüfen der Abläufe etc.) beugen Sie Verstopfungen und Schäden vor, die durch stehendes Wasser oder Schmutz entstehen könnten. So bleibt Ihr Flachdach langfristig dicht und funktionsfähig."
        }
      ]
    },
    {
      category: "Reparaturen",
      questions: [
        {
          question: "Wie lange dauert eine Dachreparatur in der Regel?",
          answer: "Die Dauer hängt stark von Art und Umfang des Schadens ab. Kleinere Reparaturen – etwa das Austauschen einiger weniger Ziegel oder das Abdichten einer kleinen Leckage – können häufig innerhalb weniger Stunden abgeschlossen werden. Umfangreichere Schäden (z.B. Sturmabriss größerer Dachbereiche oder eine aufwändige Reparatur am Unterdach) können dagegen mehrere Tage Arbeit erfordern. Wir geben Ihnen im Voraus eine Einschätzung, damit Sie planen können."
        },
        {
          question: "Was kostet eine kleine Dachreparatur?",
          answer: "Die Kosten richten sich nach dem individuellen Fall. Bei einer kleinen Reparatur – zum Beispiel dem Austausch einzelner Ziegel oder dem Abdichten einer undichten Stelle – hängen die Kosten von Umfang, Material und Zugänglichkeit ab. Oft bewegen sich solche Kleinstreparaturen im unteren dreistelligen Eurobereich, genaue Preise nennen wir Ihnen aber nach einer Begutachtung vor Ort. Selbstverständlich erhalten Sie vorab ein verbindliches Angebot, damit Sie volle Kostentransparenz haben."
        },
        {
          question: "Bieten Sie auch kurzfristige Reparaturen oder einen Notdienst an?",
          answer: "Wir versuchen, bei akuten Schäden so schnell wie möglich zu helfen. Wenn es unsere Kapazitäten zulassen, kommen wir auch kurzfristig vorbei – insbesondere bei Sturmschäden oder plötzlich auftretenden Dachundichtigkeiten in unserer Region reagieren wir so zeitnah wie möglich. Einen durchgehenden 24h-Notdienst bieten wir derzeit zwar nicht an, doch in dringenden Fällen finden wir meist eine schnelle Lösung innerhalb unserer Geschäftszeiten. Melden Sie Schäden also am besten sofort, damit wir schnell helfen können."
        },
        {
          question: "Was soll ich tun, wenn mein Dach undicht ist oder einen Schaden hat?",
          answer: "Bewahren Sie Ruhe, aber handeln Sie zeitnah. Decken Sie die undichte Stelle, falls gefahrlos möglich, provisorisch mit einer Plane ab, um weiteren Wassereintritt zu verhindern. Kontaktieren Sie uns anschließend umgehend – wir kümmern uns so schnell wie möglich um die Reparatur. Bitte haben Sie Verständnis, dass wir keinen 24h-Notdienst anbieten; wir tun jedoch unser Bestes, um dringende Lecks so zeitnah wie möglich während unserer Arbeitszeit zu beheben. Falls die Witterung es erfordert, können Sie im Notfall auch die Feuerwehr zur Ersthilfe (Abplanen des Dachs) hinzuziehen, bis wir eingreifen."
        },
        {
          question: "Übernehmen Sie auch sehr kleine Reparaturen (z.B. einzelne Dachziegel austauschen)?",
          answer: "Ja – selbstverständlich führen wir auch Kleinstreparaturen zuverlässig für Sie aus. Egal ob ein einzelner Ziegel locker oder zerbrochen ist, ein kurzer Abschnitt der Dachrinne leckt oder eine kleine Stelle neu abgedichtet werden muss: Solche Arbeiten erledigen wir prompt und sorgfältig. Auch wenn es 'nur' eine Kleinigkeit ist, lohnt sich die Reparatur, um größeren Folgeschäden vorzubeugen. Kein Auftrag ist für uns zu klein – Ihr Dach soll rundum intakt sein."
        }
      ]
    },
    {
      category: "Velux-Dachfenster",
      questions: [
        {
          question: "Was kostet der Einbau eines VELUX-Dachfensters?",
          answer: "Die Kosten für den nachträglichen Einbau eines neuen VELUX-Dachfensters liegen – inklusive Fenster – je nach Größe, Verglasung und Innenfutter typischerweise bei etwa 1.200 bis 2.500 €. Wenn bereits ein altes Dachfenster vorhanden ist und es nur ausgetauscht wird, ist es meist etwas günstiger, da der Dachauschnitt schon existiert und weniger Anpassungen nötig sind. In diesem Preis sind alle notwendigen Arbeiten (Montage, Innenverkleidung, Anschlüsse und Entsorgung des alten Fensters) eingerechnet. Gern erstellen wir Ihnen für Ihr konkretes Vorhaben ein individuelles Angebot."
        },
        {
          question: "Wie lange dauert der Einbau oder Austausch eines Dachfensters?",
          answer: "Erfreulicherweise ist der Fenstereinbau in der Regel an einem Tag erledigt. Pro Dachfenster planen wir normalerweise etwa einen Arbeitstag ein – darin sind Vorbereitung (z.B. Zuschnitt der Dachöffnung), die eigentliche Montage sowie der Innenausbau und die Abdichtung enthalten. Sie können Ihr neues VELUX-Fenster also meist schon am Abend des Einbautages voll nutzen."
        },
        {
          question: "Benötigt man eine Baugenehmigung, um ein Dachfenster einzubauen?",
          answer: "In den meisten Fällen ist der Einbau einzelner Dachfenster genehmigungsfrei, da er als untergeordnete bauliche Änderung gilt. Allerdings können lokale Bauvorschriften abweichen. Gehen Sie auf Nummer sicher und lassen Sie Ihr Vorhaben im Zweifel von der zuständigen Gemeinde prüfen – Bebauungspläne oder Denkmalschutzauflagen können eine Rolle spielen. Wichtig ist auch, vorab statisch zu klären, ob Änderungen an Sparren nötig sind (bei größeren Fenstern). In Summe gilt: Meist keine Genehmigung erforderlich, aber im Zweifel lieber bei der Behörde nachfragen."
        },
        {
          question: "Kann ich ein Dachfenster selbst einbauen, oder sollte das ein Fachmann machen?",
          answer: "Wir raten dringend zum Fachmann. Der Einbau eines Dachfensters erfordert Erfahrung und Präzision – das Fenster muss absolut passgenau eingesetzt und wasserdicht angeschlossen werden. Schon kleine Fehler können zu Undichtigkeiten führen. Ohne Profi-Wissen ist die Aufgabe sehr schwierig: Zwar mag ein geübter Handwerker ~4–6 Stunden für einen Fenstereinbau benötigen, aber für Unerfahrene ist das nichts. Zudem müssen Anschlüsse, Dämmung und Innenverkleidung fachgerecht ausgeführt werden. Kurz: Überlassen Sie den Dachfenstereinbau lieber unseren geschulten Dachdeckern, um Schäden zu vermeiden und die Herstellergarantie zu sichern."
        },
        {
          question: "Kann ein altes Dachfenster durch ein modernes VELUX-Fenster ersetzt werden?",
          answer: "Ja, das ist problemlos möglich. Wir tauschen regelmäßig alte Dachfenster (auch von anderen Marken) gegen neue VELUX-Fenster aus. Moderne VELUX-Modelle bieten zahlreiche Vorteile: sie sind deutlich besser isoliert (weniger Wärmeverlust), oft größer oder mit mehr Lichteinfall und auf Wunsch mit Zusatzausstattungen wie automatischer Steuerung erhältlich. Der Austausch wird von uns sauber und zügig durchgeführt, inklusive aller Innenverkleidungen, Anschlüsse und Entsorgung des Altfensters – Ihr Dach ist danach wieder dicht und technisch auf dem neuesten Stand."
        }
      ]
    },
    {
      category: "Dachrinnen & Fallrohre",
      questions: [
        {
          question: "Was kostet der Austausch einer Dachrinne mit Fallrohren?",
          answer: "Die Kosten für eine Dachrinnenerneuerung hängen vor allem vom gewählten Material und der Gebäudelänge ab. Als groben Richtwert kann man mit ca. 20–40 € pro laufendem Meter Regenrinne inklusive Montage rechnen – Kunststoff-Dachrinnen liegen am unteren Ende, Kupfer-Dachrinnen am oberen. Für ein Einfamilienhaus mit rund 20 m Dachrinne ergibt sich so beispielsweise ein Gesamtpreis von etwa 600–1.200 € (inkl. Montage, Fallrohre und Gerüst). Wir schauen uns Ihr Haus an und machen Ihnen dann einen konkreten Festpreis."
        },
        {
          question: "Welches Material ist für Dachrinnen am besten geeignet – Kunststoff, Zink oder Kupfer?",
          answer: "Jedes Material hat Vor- und Nachteile. Kunststoff-Dachrinnen sind am günstigsten in der Anschaffung, aber weniger langlebig – oft müssen sie schon nach wenigen Jahren ersetzt werden, weil das Material spröde wird. Metall-Dachrinnen aus Titanzink oder Aluminium sind robuster und halten deutlich länger (häufig 15–25 Jahre), Kupfer hält am längsten – durchschnittlich bis zu 30 Jahren. Kupfer ist zwar teurer, aber diese Investition amortisiert sich durch die hohe Lebensdauer oft wieder. Wir empfehlen bei Neubauten meist Zink oder Kupfer wegen der Haltbarkeit; Kunststoff kann eine Option für kleinere Nebenbauten sein, wenn das Budget im Vordergrund steht."
        },
        {
          question: "Woran erkennt man eine verstopfte oder defekte Dachrinne?",
          answer: "Eine verstopfte oder beschädigte Regenrinne macht sich oft durch typische Warnsignale bemerkbar: Wasser läuft über den Rinnenrand (Überlauf bei Regen), feuchte Flecken oder dunkle Streifen an der Fassade unter der Rinne, Eiszapfen im Winter (stehendes Wasser gefriert), sowie Laub, Moos oder sogar kleine Pflanzen in der Rinne. Wenn Sie solche Anzeichen bemerken, sollten Sie die Dachrinne umgehend reinigen (lassen). Eine verstopfte Rinne kann nämlich ernsthafte Schäden verursachen – stehendes Wasser greift die Bausubstanz an und Feuchtigkeit kann ins Mauerwerk eindringen."
        },
        {
          question: "Kann man eine undichte Dachrinne reparieren, oder muss sie ausgetauscht werden?",
          answer: "Das hängt vom Ausmaß der Schäden ab. Kleinere Undichtigkeiten (z.B. einzelne Löchlein oder undichte Nahtstellen) kann man oft gezielt abdichten – etwa mit speziellem Dichtmittel oder durch Einsetzen von Reparaturstücken. Bei größeren Schäden lohnt eine Reparatur jedoch meistens nicht mehr: Wenn die Rinne schon viele Löcher oder Risse aufweist oder großflächig rostig ist, ist ein Austausch ratsamer. In solchen Fällen ersetzen wir die schadhaften Rinnenstücke komplett. Manchmal reicht es auch, nur Teilstücke zu erneuern, falls z.B. nur ein Abschnitt irreparabel beschädigt ist. Wir beraten Sie ehrlich, ob eine Reparatur noch sinnvoll ist oder nicht."
        },
        {
          question: "Empfehlen Sie Laubschutzgitter für Dachrinnen?",
          answer: "In vielen Fällen ja. Gerade wenn Bäume in der Nähe des Dachs stehen, können Laubschutzgitter sehr sinnvoll sein, um ein Verstopfen der Rinnen zu verhindern. Diese Gitter werden in die Dachrinne eingelegt und fangen Blätter und groben Schmutz auf – dadurch bleibt die Rinne deutlich länger frei, und die nötigen Reinigungsintervalle verlängern sich. Wir können solche Laubfangsysteme auf Wunsch installieren (oft direkt bei einer Reinigung mit). Bedenken Sie aber: Ganz auf Reinigung verzichten kann man trotz Laubschutz nicht – feinere Ablagerungen sollten weiterhin hin und wieder entfernt werden, nur eben seltener."
        }
      ]
    },
    {
      category: "Spengler- und Klempnerarbeiten",
      questions: [
        {
          question: "Was fällt alles unter Spengler- bzw. Klempnerarbeiten am Dach?",
          answer: "Unter Spenglerarbeiten (auch Bauklempnerei genannt) versteht man alle Metallarbeiten am Dach. Dazu gehören insbesondere die Dachentwässerung – also Dachrinnen und Fallrohre montieren – sowie das Anbringen von Blechverkleidungen und Anschlüssen. Beispielsweise fertigen wir Blecheinfassungen an Schornsteinen, Abdichtungen an Wandanschlüssen, Verblechungen an Dachkanten (Attika) und Gauben sowie ganze Metalldächer (z.B. in Stehfalz-Technik). Kurz gesagt: Alle Arbeiten mit Zink, Kupfer, Aluminium & Co am Dach und an der Fassade (Verkleidungen, Abdeckungen, Rinnen) fallen in diesen Bereich."
        },
        {
          question: "Welche Vorteile hat eine Dachdeckung aus Metall (Blechdach)?",
          answer: "Metalldächer bieten einige spezielle Vorteile. Sie sind sehr langlebig (Lebensdauern von 50 Jahren und mehr sind keine Seltenheit) und dabei vergleichsweise leicht, was gerade bei größeren Spannweiten die Dachkonstruktion entlastet. Außerdem sind Metalleindeckungen sturm- und hagelresistent – ein fachgerecht montiertes Blechdach hält extreme Wetterereignisse oft besser aus als ein Ziegeldach. Ein weiterer Pluspunkt ist die Nachhaltigkeit: Metalle wie Zink oder Aluminium lassen sich nahezu 100 % recyceln und sind somit umweltfreundlich. Und nicht zuletzt ist der Wartungsaufwand gering, da Metall nicht porös ist und Moosbewuchs kaum ansetzt."
        },
        {
          question: "Eignet sich eine Metallbedachung auch für ältere Dächer?",
          answer: "Ja, auf jeden Fall. Gerade bei älteren Gebäuden kann ein leichteres Metalldach sogar von Vorteil sein. Oft haben ältere Dächer einen größeren Sparrenabstand oder die Statik ist für schwere Ziegel nicht optimal – hier empfiehlt sich eine leichte Bedachung aus Metall. Zum Beispiel wiegt eine Aluminium- oder Zinkeindeckung deutlich weniger als klassische Tonziegel, entlastet also den Dachstuhl. Wir prüfen natürlich immer vorab die Konstruktion, aber in vielen Fällen ist es kein Problem, nachträglich auf Blech umzurüsten. Im Gegenteil: Es bietet eine moderne, langlebige Lösung für alte Dächer."
        },
        {
          question: "Ist Regen auf einem Metalldach lauter als auf einem Ziegeldach?",
          answer: "Unbehandelt kann ein Regenschauer auf einem dünnen Blechdach tatsächlich lauter klingen als auf schweren Ziegeln. Allerdings werden Metalldächer heute immer mit Schalldämmmaßnahmen kombiniert – zum Beispiel mit einer dicken Unterdämmung oder speziellen schalldämpfenden Vliesunterlagen. Dadurch wird der Trommeleffekt erheblich reduziert. Moderne Aufbauten erfüllen die Schallschutz-Vorschriften: Ein gut gedämmtes Metalldach ist akustisch kaum lauter als ein Ziegeldach. Bei der Planung achten wir darauf, dass Regen- und Hagelgeräusche durch passende Dämmstoffe minimal gehalten werden."
        },
        {
          question: "Fertigen Sie auch Verkleidungen in Metall an (z.B. Gauben, Kamineinfassungen)?",
          answer: "Ja. Als Spenglerbetrieb übernehmen wir alle Arten von Metallverkleidungen an Dach und Fassade. Wir fertigen zum Beispiel passgenaue Kaminverkleidungen, bekleiden Ihre Gauben mit Zink- oder Kupferblech und verkleiden Flachdach-Attiken (Brüstungen) mit Kantblechen. Auch Mauerabdeckungen aus Metall, Gesimsverblechungen und ähnliche Arbeiten gehören dazu. Diese individuellen Blecharbeiten stellen sicher, dass exponierte Stellen wie Kamine oder Gauben dauerhaft wettergeschützt und optisch ansprechend verkleidet sind. Sämtliche Verblechungen werden von uns millimetergenau zugeschnitten und fachgerecht montiert – Ihr Dach bleibt dicht und sieht gepflegt aus."
        }
      ]
    },
    {
      category: "Flüssigkunststoffe",
      questions: [
        {
          question: "Was ist Flüssigkunststoff und wofür wird er am Dach eingesetzt?",
          answer: "Flüssigkunststoff ist ein hochentwickeltes flüssiges Abdichtungsharz, das zur nahtlosen Dachabdichtung verwendet wird. Er wird direkt auf die bestehende Dachfläche aufgetragen und härtet dort zu einer durchgehenden, elastischen Membran aus. Dieses Verfahren hat den Vorteil, dass keine Nähte oder Fugen entstehen und das Material sich flexibel an jede Dachgeometrie anschmiegt – ideal also für komplizierte Details, Anschlüsse, Durchdringungen oder Sanierungen von Flachdächern, bei denen man die alte Abdichtung nicht komplett abreißen möchte. Nach dem Aushärten bildet Flüssigkunststoff eine wasserdichte, UV-beständige Schicht auf dem Dach, die selbst Temperaturschwankungen rissfrei übersteht."
        },
        {
          question: "Welche Vorteile hat eine Flüssigkunststoff-Abdichtung?",
          answer: "Flüssigkunststoff bringt gleich mehrere Vorteile mit sich: Nahtlose Abdichtung ohne Fugen, durch die Wasser eindringen könnte. Kosteneffizienz, da eine Sanierung oft deutlich günstiger ist als eine komplette Neueindeckung. Schnelle Umsetzung – der Flüssigkunststoff ist innerhalb weniger Stunden ausgehärtet, was kurze Baustellenzeit bedeutet. Universell einsetzbar auf fast allen Untergründen (Bitumen, Blech, Beton, Kunststofffolien). Langlebig und umweltfreundlich mit einer Lebensdauer von bis zu 25 Jahren, dabei UV-beständig und rissüberbrückend."
        },
        {
          question: "Wie lange hält eine Dachabdichtung mit Flüssigkunststoff?",
          answer: "Die Haltbarkeit einer Flüssigkunststoff-Abdichtung ist sehr hoch. Je nach eingesetztem System und Witterungsbeanspruchung kann eine solche Beschichtung bis zu 25 Jahre dicht bleiben. Damit übertrifft Flüssigkunststoff in vielen Fällen klassische Dachabdichtungen aus Bahnen. Wichtig ist natürlich eine fachgerechte Ausführung und gelegentliche Kontrolle, aber grundsätzlich sind Flüssigabdichtungen auf lange Lebensdauer ausgelegt."
        },
        {
          question: "Kann Flüssigkunststoff auf dem vorhandenen Dach aufgetragen werden?",
          answer: "Ja, genau darin liegt ein großer Vorteil dieses Verfahrens. Flüssigkunststoff lässt sich auf nahezu jedem Untergrund verarbeiten – egal ob Ihre vorhandene Dachabdichtung aus Bitumen, Beton, Blech oder Kunststoff besteht. Mit einer abgestimmten Grundierung haftet der Flüssigkunststoff zuverlässig darauf und bildet eine neue, dichte Oberflächenschicht. Das bedeutet: In vielen Fällen muss das alte Dach nicht abgerissen werden. Wir reinigen den Untergrund, grundieren ihn und tragen den Flüssigkunststoff auf – so erhält Ihr Dach eine neue Abdichtung, ohne dass die bestehende Substanz entfernt werden muss."
        },
        {
          question: "Ist eine Flüssigkunststoff-Abdichtung wirklich dauerhaft wetterfest?",
          answer: "Absolut. Sobald der Flüssigkunststoff ausgehärtet ist, bildet er eine dauerhaft wetterfeste und dichtschließende Oberfläche. Die Beschichtung ist UV-beständig (Sonnenstrahlen können ihr kaum etwas anhaben), frostresistent und bleibt auch bei großen Temperaturwechseln elastisch, sodass keine Risse durch Wärmedehnung entstehen. Regen, Schnee, Eis oder intensive Sonneneinstrahlung – all dem hält eine korrekt aufgebrachte Flüssigkunststoff-Abdichtung stand, und das über viele Jahre. Selbst stehendes Wasser auf Flachdächern ist unproblematisch, da die nahtlose Schicht absolut wasserdicht ist."
        }
      ]
    },
    {
      category: "Wartung",
      questions: [
        {
          question: "Wie oft sollte ein Dach gewartet oder kontrolliert werden?",
          answer: "Generell empfehlen wir, mindestens einmal im Jahr eine Dachinspektion durchführen zu lassen. Bei Steildächern ist eine jährliche Wartung in der Regel ausreichend. Flachdächer oder Dachflächen mit viel Anlagetechnik (Solaranlagen, Dachfenster etc.) sollten eher zweimal jährlich geprüft und gereinigt werden – idealerweise im Frühjahr und Herbst. Nach schweren Stürmen oder Unwettern ist es ebenfalls ratsam, das Dach kurz zu kontrollieren. Regelmäßige Wartung stellt sicher, dass Schäden früh erkannt und behoben werden, bevor Feuchtigkeit größeren Schaden anrichten kann."
        },
        {
          question: "Was wird bei einer Dachwartung gemacht?",
          answer: "Bei einer Dachwartung wird das Dach umfassend überprüft und gereinigt. Unser Dachdecker-Team kontrolliert die Dacheindeckung (Ziegel, Schindeln, Bahnen etc.) auf beschädigte oder fehlende Teile. Außerdem werden alle Anschlüsse und Abschlüsse geprüft – zum Beispiel die Einfassungen an Schornstein und Gauben, die Abdichtungen rund um Dachfenster sowie Übergänge zu Wänden. Ein wichtiger Punkt ist auch die Dachentwässerung: Dachrinnen und Fallrohre werden auf Verstopfung geprüft und bei Bedarf gereinigt. Kurz gesagt: Wir beseitigen Laub und Schmutz, ziehen lockere Schrauben nach, ersetzen kleine Dichtungen – all das, was nötig ist, damit Ihr Dach wieder in Top-Zustand ist."
        },
        {
          question: "Warum ist eine regelmäßige Dachwartung sinnvoll?",
          answer: "Eine regelmäßige Wartung dient Ihrer Vorbeugung. Durch Inspektionen lassen sich größere Schäden vermeiden, bevor sie entstehen. Beispielsweise können wir eine kleine Undichtigkeit entdecken und reparieren, bevor Feuchtigkeit größere Mängel (wie Fäulnis im Gebälk oder Schimmel) verursacht. Das spart Ihnen nicht nur Kosten, sondern auch Ärger und schützt die Bausubstanz. Ein regelmäßiger Dach-Check erhöht außerdem die Lebensdauer des Dachs – ähnlich wie der Kundendienst beim Auto. Insgesamt gilt: Ein gewartetes Dach bleibt dichter und sicherer, während mangelnde Wartung oft erst bemerkt wird, wenn bereits ein Schaden aufgetreten ist."
        },
        {
          question: "Bieten Sie Wartungsverträge oder jährliche Dachinspektionen an?",
          answer: "Ja, diese Möglichkeit gibt es. Wir bieten unseren Kunden einen Wartungsvertrag an – quasi ein Abo für die Dachwartung. Das bedeutet: Wir kommen automatisch in den vereinbarten Intervallen (z.B. jährlich oder halbjährlich) vorbei, kontrollieren und reinigen Ihr Dach und führen kleinere Reparaturen direkt durch. So müssen Sie sich um nichts kümmern und haben die Sicherheit, dass Ihr Dach stets betreut ist. Selbstverständlich können Sie aber auch ohne Vertrag jederzeit einen Wartungstermin bei uns vereinbaren. Unser Dach-Check-Angebot lässt sich flexibel an Ihre Bedürfnisse anpassen."
        },
        {
          question: "Was kostet eine Dachwartung bzw. Dachinspektion?",
          answer: "Die Kosten für eine Wartung hängen von verschiedenen Faktoren ab – insbesondere von Größe, Höhe und Art Ihres Dachs sowie vom Zustand (ein sehr verschmutztes oder schwer zugängliches Dach erfordert etwas mehr Aufwand). Typischerweise bewegen sich die Kosten für eine einfache jährliche Inspektion in einem moderaten Bereich. Wir berechnen den Preis individuell: Nach einer kurzen Aufnahme der Dachdaten erhalten Sie von uns ein faires Angebot. Oft bieten wir auch Wartungspakete an – beispielsweise einen vergünstigten Preis, wenn Sie einen jährlichen Servicevertrag abschließen. Sprechen Sie uns darauf an; die Investition in regelmäßige Wartung lohnt sich, weil sie teure Reparaturen verhindern hilft."
        }
      ]
    },
    {
      category: "Dachrinnenreinigung",
      questions: [
        {
          question: "Warum ist eine regelmäßige Dachrinnenreinigung wichtig?",
          answer: "Die Dachrinne ist ein oft unterschätzter Teil des Daches – sie sorgt dafür, dass Regenwasser sicher vom Haus weggeleitet wird. Verstopfte Dachrinnen können daher ernsthafte Schäden verursachen: Läuft das Wasser ständig über, kann es in die Fassade oder sogar ins Fundament eindringen und dort Feuchtigkeitsschäden und Schimmel verursachen. Außerdem können sich in den angesammelten feuchten Laubablagerungen Schädlinge oder Mikroorganismen einnisten, die das Material der Rinne angreifen. Eine regelmäßige Reinigung (vor allem im Herbst, wenn viel Laub fällt) verhindert solche Verstopfungen und stellt sicher, dass das Regenwasser ungehindert abfließen kann – das schützt Ihr Haus vor kostspieligen Wasserschäden."
        },
        {
          question: "Wie oft sollten Dachrinnen gereinigt werden?",
          answer: "Bewährt hat sich eine zweimalige Reinigung pro Jahr: einmal im Frühjahr und einmal im Herbst. Im Herbst fällt das meiste Laub an, das sollte vor dem Winter aus der Rinne entfernt werden, damit Regen- und Schmelzwasser ablaufen können. Im Frühjahr empfiehlt sich eine Kontrolle, um eventuellen Schmutz des Winters (Zweige, Moos etc.) zu beseitigen. Mindestens einmal jährlich sollten Sie die Rinnen jedoch in jedem Fall säubern. In waldreichen Umgebungen oder bei sehr vielen Bäumen am Haus kann auch eine zusätzliche Sommer-Reinigung sinnvoll sein. Wichtig ist: Lassen Sie die Rinne nicht jahrelang ungereinigt – die Folgen einer Verstopfung (Wasserüberlauf) können teuer werden."
        },
        {
          question: "Kann ich die Dachrinnenreinigung selbst durchführen?",
          answer: "Theoretisch ja, praktisch ist jedoch Vorsicht geboten. Die Arbeit auf der Leiter in Höhe des Daches ist nicht ungefährlich – jedes Jahr passieren Unfälle, weil Hausbesitzer bei der Rinnenreinigung abstürzen oder sich verletzen. Wenn Sie sich dennoch selbst daran wagen: Nutzen Sie eine standsichere Leiter, tragen Sie Handschuhe und sichern Sie sich möglichst ab. Bedenken Sie aber, dass Reinigungsmethoden vom Boden aus (mit Teleskopstange o. Ä.) meist nicht gründlich genug sind – man hat kaum Sicht und lässt leicht Schmutz in der Rinne zurück. Außerdem können unsachgemäße Versuche die Dachrinne oder Fassade beschädigen. Unser Rat: Überlassen Sie aus Sicherheitsgründen die Dachrinnenreinigung lieber unserem geschulten Personal – wir haben die Ausrüstung und Erfahrung, um Ihre Rinne schnell und gefahrlos zu säubern."
        },
        {
          question: "Was kostet eine professionelle Dachrinnenreinigung?",
          answer: "Die Kosten sind überschaubar und richten sich meist nach der Länge der Dachrinne. Als Anhaltspunkt verlangen Fachbetriebe oft ca. 2,50 € bis 3,50 € pro laufendem Meter Dachrinne für die Reinigung. Hinzu kommt in der Regel eine Anfahrt- und Aufwandspauschale von ~35–50 €. Für ein typisches Einfamilienhaus mit z.B. 30 m Rinnenlänge können Sie insgesamt ungefähr 100 bis 200 € einplanen. Diese Investition lohnt sich, wenn man bedenkt, dass eine verstopfte Rinne schwere Wasserschäden verursachen könnte. Selbstverständlich erstellen wir Ihnen gern einen festen Preis für Ihr Objekt – oftmals können wir bei regelmäßiger Beauftragung einen Pauschalpreis vereinbaren."
        },
        {
          question: "Bieten Sie einen regelmäßigen Reinigungsservice für Dachrinnen an (z.B. jährlich)?",
          answer: "Ja, den bieten wir an. Viele unserer Kunden nutzen unseren Wartungsservice, bei dem wir automatisch in festgelegten Intervallen – zum Beispiel jährlich im Herbst – zur Dachrinnenreinigung vorbeikommen. Sie müssen dann nicht mehr selbst an den Termin denken; wir melden uns zur rechten Zeit und führen die Reinigung zuverlässig durch. Auf Wunsch kombinieren wir die Dachrinnenreinigung auch mit einer Dachinspektion, um zwei Fliegen mit einer Klappe zu schlagen. Sprechen Sie uns einfach darauf an – ein regelmäßiger Reinigungsservice stellt sicher, dass Ihre Rinnen stets frei sind, ohne dass Sie sich darum kümmern müssen."
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>FAQ - Häufig gestellte Fragen | Rex Bedachungs GmbH</title>
        <meta name="description" content="Antworten auf häufig gestellte Fragen zu Dacharbeiten, Kosten, Wartung und mehr. Erfahren Sie alles über Steildach, Flachdach, Dachfenster und Reparaturen." />
        <meta property="og:title" content="FAQ - Rex Bedachungs GmbH" />
        <meta property="og:description" content="Häufig gestellte Fragen zu allen Dacharbeiten - von Angeboten über Reparaturen bis zur Wartung." />
      </Helmet>

      <Hero
        title="Häufig gestellte Fragen"
        subtitle="Antworten auf Ihre Fragen"
        description="Finden Sie schnell Antworten auf die wichtigsten Fragen rund um Dacharbeiten, Kosten, Wartung und unsere Leistungen."
        imageUrl={heroImage}
        imageAlt="FAQ Rex Bedachungs GmbH"
        showCTAs={false}
      />

      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`${categoryIndex}-${index}`}
                      className="border border-border rounded-md px-6 bg-card"
                      data-testid={`accordion-item-${categoryIndex}-${index}`}
                    >
                      <AccordionTrigger
                        className="text-left hover:no-underline py-4"
                        data-testid={`accordion-trigger-${categoryIndex}-${index}`}
                      >
                        <span className="font-medium text-foreground pr-4">
                          {item.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent
                        className="text-muted-foreground pb-4 leading-relaxed"
                        data-testid={`accordion-content-${categoryIndex}-${index}`}
                      >
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-card border border-card-border rounded-md text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              Ihre Frage war nicht dabei?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Kein Problem! Kontaktieren Sie uns gerne direkt – wir beantworten Ihre Fragen 
              persönlich und erstellen Ihnen ein individuelles Angebot für Ihr Dachprojekt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:0234583100"
                className="inline-flex items-center justify-center gap-2 min-h-9 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground border border-primary-border hover-elevate active-elevate-2"
                data-testid="button-call-faq"
              >
                <span>0234-583100</span>
              </a>
              <a
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 min-h-9 px-4 py-2 rounded-md text-sm font-medium border border-border bg-card text-card-foreground hover-elevate active-elevate-2"
                data-testid="link-contact-faq"
              >
                Kontaktformular
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
