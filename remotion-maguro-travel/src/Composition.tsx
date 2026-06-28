import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const asset = (name: string) => staticFile(`maguro-travel/${name}`);
const healthyAsset = (name: string) => staticFile(`maguro-2018/${name}`);
const synergeticAsset = (name: string) => staticFile(`synergetic/${name}`);
const biottaAsset = (name: string) => staticFile(`biotta/${name}`);
const scotchBriteAsset = (name: string) => staticFile(`scotch-brite/${name}`);

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const sceneIn = (frame: number, start: number) =>
  interpolate(frame, [start, start + 22], [0, 1], {...clamp, easing: ease});

const sceneOut = (frame: number, end: number) =>
  interpolate(frame, [end - 24, end], [1, 0], {...clamp, easing: ease});

const KenBurnsImage: React.FC<{
  src: string;
  start: number;
  end: number;
  from?: number;
  to?: number;
  opacity?: number;
  resolver?: (name: string) => string;
}> = ({src, start, end, from = 1.04, to = 1.12, opacity = 1, resolver = asset}) => {
  const frame = useCurrentFrame();
  return (
    <Img
      src={resolver(src)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity,
        scale: interpolate(frame, [start, end], [from, to], clamp),
      }}
    />
  );
};

const Label: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      color: "#ffd85a",
      fontSize: 34,
      fontWeight: 900,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const BigTitle: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      color: "#fff",
      fontSize: 112,
      fontWeight: 950,
      letterSpacing: "-0.07em",
      lineHeight: 0.9,
      maxWidth: 1100,
    }}
  >
    {children}
  </div>
);

const TextBlock: React.FC<{
  label: string;
  title: React.ReactNode;
  body: string;
  align?: "left" | "right" | "center";
}> = ({label, title, body, align = "left"}) => {
  return (
    <div
      style={{
        alignItems: align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start",
        display: "flex",
        flexDirection: "column",
        gap: 28,
        maxWidth: align === "center" ? 1180 : 940,
        textAlign: align,
      }}
    >
      <Label>{label}</Label>
      <BigTitle>{title}</BigTitle>
      <div
        style={{
          color: "rgba(255,255,255,0.82)",
          fontSize: 46,
          fontWeight: 650,
          lineHeight: 1.18,
          maxWidth: 880,
        }}
      >
        {body}
      </div>
    </div>
  );
};

const DarkOverlay: React.FC<{opacity?: number}> = ({opacity = 0.56}) => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(90deg, rgba(8,20,31,0.92), rgba(8,20,31,0.56) 46%, rgba(8,20,31,0.18))",
      opacity,
    }}
  />
);

const FloatingRoute: React.FC<{start: number; end: number}> = ({start, end}) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [start, start + 70], [0, 1], clamp);
  const drift = interpolate(frame, [start, end], [0, 80], clamp);
  return (
    <svg
      viewBox="0 0 1920 1080"
      style={{
        inset: 0,
        opacity: 0.72,
        position: "absolute",
        translate: `${drift}px 0px`,
      }}
    >
      <path
        d="M205 820 C 420 620, 560 750, 760 520 S 1140 330, 1350 520 S 1600 680, 1740 420"
        fill="none"
        stroke="#ffd85a"
        strokeDasharray="20 24"
        strokeLinecap="round"
        strokeWidth="8"
        style={{
          opacity: reveal,
          strokeDashoffset: interpolate(frame, [start, end], [900, 0], clamp),
        }}
      />
      {[260, 760, 1250, 1660].map((cx, index) => (
        <circle
          cx={cx}
          cy={[768, 525, 430, 485][index]}
          fill="#cc1427"
          key={cx}
          r={interpolate(frame, [start + 12 * index, start + 12 * index + 18], [0, 18], clamp)}
          stroke="#fff"
          strokeWidth="7"
        />
      ))}
    </svg>
  );
};

const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneIn(frame, 0) * sceneOut(frame, 95);
  return (
    <AbsoluteFill style={{background: "#08141f", opacity}}>
      <KenBurnsImage src="hero-original.jpg" start={0} end={110} />
      <DarkOverlay />
      <FloatingRoute start={12} end={105} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          paddingLeft: 130,
          paddingRight: 130,
        }}
      >
        <div
          style={{
            opacity: sceneIn(frame, 10),
            translate: `${interpolate(frame, [10, 34], [-54, 0], clamp)}px 0px`,
          }}
        >
          <TextBlock
            body="Seafood wird zur kleinen Expedition: Karte, Rezepte und Wettbewerb fuehren durch die Marke."
            label="Maguro Travel · 2017"
            title={<>Ein Geschmackstrip durch die Seafood-Welt</>}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ConstructorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 88;
  const end = 190;
  const opacity = sceneIn(frame, start) * sceneOut(frame, end);
  return (
    <AbsoluteFill style={{background: "#0c2330", opacity}}>
      <KenBurnsImage src="constructor.jpg" start={start} end={end} from={1.02} to={1.08} opacity={0.9} />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(7,20,30,0.35), rgba(7,20,30,0.82))"}} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 130px 108px",
        }}
      >
        <div
          style={{
            opacity: sceneIn(frame, start + 10),
            scale: interpolate(frame, [start + 10, start + 34], [0.94, 1], clamp),
          }}
        >
          <TextBlock
            align="center"
            body="Der Konstruktor macht aus Inspiration eine Handlung: Nutzer kombinieren Zutaten und bauen ihr eigenes Gericht."
            label="Interaktion"
            title={<>Vom Kartenmotiv zum eigenen Gericht</>}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const RecipeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 178;
  const end = 286;
  const opacity = sceneIn(frame, start) * sceneOut(frame, end);
  const cards = ["recipe-01.jpg", "recipe-02.jpg", "recipe-03.jpg"];
  return (
    <AbsoluteFill style={{background: "#f2f4f6", opacity}}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 18% 20%, rgba(255,216,90,0.34), transparent 28%), linear-gradient(135deg, #eef4f7, #ffffff)",
        }}
      />
      <AbsoluteFill
        style={{
          display: "grid",
          gap: 54,
          gridTemplateColumns: "0.82fr 1.18fr",
          padding: "110px 130px",
        }}
      >
        <div
          style={{
            alignSelf: "center",
            opacity: sceneIn(frame, start + 8),
            translate: `${interpolate(frame, [start + 8, start + 34], [-42, 0], clamp)}px 0px`,
          }}
        >
          <div style={{color: "#cc1427", fontSize: 34, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase"}}>
            Rezepte
          </div>
          <div style={{color: "#101820", fontSize: 102, fontWeight: 950, letterSpacing: "-0.07em", lineHeight: 0.92, marginTop: 28}}>
            Seafood wird sofort kochbar
          </div>
          <div style={{color: "#50606a", fontSize: 44, fontWeight: 650, lineHeight: 1.2, marginTop: 30}}>
            Drei Karten zeigen den Nutzwert: schnell erfassbar, appetitlich, direkt aus dem Special.
          </div>
        </div>
        <div style={{alignItems: "center", display: "flex", gap: 26}}>
          {cards.map((card, index) => (
            <Img
              key={card}
              src={asset(card)}
              style={{
                borderRadius: 34,
                boxShadow: "0 32px 80px rgba(16,24,32,0.18)",
                height: 610,
                objectFit: "cover",
                opacity: sceneIn(frame, start + 14 + index * 10),
                scale: interpolate(frame, [start + 14 + index * 10, start + 40 + index * 10], [0.88, 1], clamp),
                width: 310,
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ContestScene: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 272;
  const end = 360;
  const opacity = sceneIn(frame, start);
  return (
    <AbsoluteFill style={{background: "#08141f", opacity}}>
      <KenBurnsImage src="contest.jpg" start={start} end={end} from={1.02} to={1.09} />
      <DarkOverlay opacity={0.74} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 130px",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: 34,
            opacity: sceneIn(frame, start + 8),
            textAlign: "center",
          }}
        >
          <Img src={asset("maguro-logo-red.png")} style={{height: 92, objectFit: "contain"}} />
          <TextBlock
            align="center"
            body="Die Reise endet nicht beim Lesen. Der Wettbewerb macht daraus Teilnahme."
            label="Finale"
            title={<>Contest als Aktivierung</>}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const HealthyHeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneIn(frame, 0) * sceneOut(frame, 98);
  return (
    <AbsoluteFill style={{background: "#15191d", opacity}}>
      <KenBurnsImage resolver={healthyAsset} src="hero-concept.jpg" start={0} end={110} from={1.02} to={1.09} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(10,12,15,0.82), rgba(10,12,15,0.34) 48%, rgba(10,12,15,0.08))",
        }}
      />
      <AbsoluteFill style={{justifyContent: "center", padding: "0 130px"}}>
        <div
          style={{
            opacity: sceneIn(frame, 8),
            translate: `${interpolate(frame, [8, 34], [-54, 0], clamp)}px 0px`,
          }}
        >
          <TextBlock
            body="Maguro zeigt gesunden Lifestyle als Zusammenspiel aus Seafood, Bewegung und Motivation."
            label="Maguro · 2018"
            title={<>Essen. Laufen. Leben.</>}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const HealthySystemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 90;
  const end = 192;
  const opacity = sceneIn(frame, start) * sceneOut(frame, end);
  const cards = [
    ["recipe-system.jpg", "Essen", "Seafood-Rezepte machen den Nutzen sofort konkret."],
    ["training-system.jpg", "Laufen", "Sportmodule bringen die Marke in Bewegung."],
    ["content-hub.jpg", "Leben", "Artikel und Routen halten die Motivation sichtbar."],
  ];

  return (
    <AbsoluteFill style={{background: "#eef2f2", opacity}}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 14% 12%, rgba(215,31,58,0.2), transparent 26%), radial-gradient(circle at 86% 78%, rgba(15,95,117,0.18), transparent 30%)",
        }}
      />
      <AbsoluteFill style={{display: "grid", gridTemplateColumns: "0.72fr 1.28fr", gap: 54, padding: "110px 130px"}}>
        <div style={{alignSelf: "center", opacity: sceneIn(frame, start + 8)}}>
          <div style={{color: "#d71f3a", fontSize: 34, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase"}}>
            System
          </div>
          <div style={{color: "#11161c", fontSize: 102, fontWeight: 950, letterSpacing: "-0.07em", lineHeight: 0.92, marginTop: 28}}>
            Drei Bereiche, ein Rhythmus
          </div>
          <div style={{color: "#50606a", fontSize: 42, fontWeight: 650, lineHeight: 1.2, marginTop: 30}}>
            Der Case wird als Plattform lesbar: Rezept, Training und Content-Hub tragen jeweils eine eigene Aufgabe.
          </div>
        </div>
        <div style={{alignItems: "center", display: "flex", gap: 24}}>
          {cards.map(([image, title, text], index) => (
            <div
              key={image}
              style={{
                background: "#fff",
                borderRadius: 34,
                boxShadow: "0 32px 80px rgba(17,22,28,0.16)",
                opacity: sceneIn(frame, start + 12 + index * 10),
                overflow: "hidden",
                scale: interpolate(frame, [start + 12 + index * 10, start + 40 + index * 10], [0.9, 1], clamp),
                width: 390,
              }}
            >
              <Img src={healthyAsset(image)} style={{height: 300, objectFit: "cover", width: "100%"}} />
              <div style={{padding: 30}}>
                <div style={{color: "#d71f3a", fontSize: 28, fontWeight: 950}}>{title}</div>
                <div style={{color: "#53606a", fontSize: 26, fontWeight: 650, lineHeight: 1.22, marginTop: 12}}>{text}</div>
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const HealthyOriginalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 180;
  const end = 286;
  const opacity = sceneIn(frame, start) * sceneOut(frame, end);
  return (
    <AbsoluteFill style={{background: "#1d2024", opacity}}>
      <KenBurnsImage resolver={healthyAsset} src="hero.jpg" start={start} end={end} from={1.01} to={1.06} />
      <DarkOverlay opacity={0.66} />
      <AbsoluteFill style={{alignItems: "flex-end", justifyContent: "center", padding: "0 130px 108px"}}>
        <div style={{opacity: sceneIn(frame, start + 10)}}>
          <TextBlock
            align="right"
            body="Der Originalscreen bleibt als Referenz: starkes Motto, Laufmotiv und die drei Navigationspunkte der Kampagne."
            label="Original"
            title={<>Der alte Screen wird zur Case-Spur</>}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const HealthyFinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 272;
  const opacity = sceneIn(frame, start);
  return (
    <AbsoluteFill style={{background: "#11161c", opacity}}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 18% 24%, rgba(215,31,58,0.34), transparent 28%), radial-gradient(circle at 82% 70%, rgba(15,95,117,0.28), transparent 32%)",
        }}
      />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", padding: "0 130px"}}>
        <div style={{alignItems: "center", display: "flex", flexDirection: "column", gap: 36, opacity: sceneIn(frame, start + 8), textAlign: "center"}}>
          <Img src={healthyAsset("logo.png")} style={{height: 96, objectFit: "contain"}} />
          <TextBlock
            align="center"
            body="Seafood wird nicht nur gezeigt. Es wird Teil einer aktiven, wiederholbaren Routine."
            label="Case-Finale"
            title={<>Eine Marke als Lifestyle-Begleiter</>}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const MaguroTravelReel: React.FC = () => {
  return (
    <AbsoluteFill style={{background: "#08141f", fontFamily: "Inter, Arial, sans-serif"}}>
      <Sequence durationInFrames={112}>
        <HeroScene />
      </Sequence>
      <Sequence durationInFrames={200}>
        <ConstructorScene />
      </Sequence>
      <Sequence durationInFrames={296}>
        <RecipeScene />
      </Sequence>
      <Sequence durationInFrames={360}>
        <ContestScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MaguroHealthyReel: React.FC = () => {
  return (
    <AbsoluteFill style={{background: "#11161c", fontFamily: "Inter, Arial, sans-serif"}}>
      <Sequence durationInFrames={112}>
        <HealthyHeroScene />
      </Sequence>
      <Sequence durationInFrames={202}>
        <HealthySystemScene />
      </Sequence>
      <Sequence durationInFrames={296}>
        <HealthyOriginalScene />
      </Sequence>
      <Sequence durationInFrames={360}>
        <HealthyFinalScene />
      </Sequence>
    </AbsoluteFill>
  );
};

const SynergeticHeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneIn(frame, 0) * sceneOut(frame, 98);
  return (
    <AbsoluteFill style={{background: "#f6fbf2", opacity}}>
      <KenBurnsImage resolver={synergeticAsset} src="hero-concept.jpg" start={0} end={112} from={1.01} to={1.07} />
      <AbsoluteFill
        style={{
          background: "linear-gradient(90deg, rgba(246,251,242,0.94), rgba(246,251,242,0.48) 48%, rgba(246,251,242,0.08))",
        }}
      />
      <AbsoluteFill style={{justifyContent: "center", padding: "0 130px"}}>
        <div
          style={{
            opacity: sceneIn(frame, 8),
            translate: `${interpolate(frame, [8, 34], [-50, 0], clamp)}px 0px`,
          }}
        >
          <div style={{color: "#61a732", fontSize: 34, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase"}}>
            Synergetic · 2018
          </div>
          <div style={{color: "#111", fontSize: 112, fontWeight: 950, letterSpacing: "-0.07em", lineHeight: 0.9, marginTop: 28, maxWidth: 1040}}>
            Eco cleaning gets concrete
          </div>
          <div style={{color: "#4f6048", fontSize: 46, fontWeight: 650, lineHeight: 1.18, marginTop: 32, maxWidth: 820}}>
            Produktleistung, Pflanzenbasis und Familienalltag werden als ein klares System lesbar.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SynergeticProductsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 90;
  const end = 202;
  const opacity = sceneIn(frame, start) * sceneOut(frame, end);
  const products = [
    ["product-bathroom.png", "Bad", "#61a732"],
    ["product-laundry.png", "Waesche", "#e2007a"],
    ["product-dish.png", "Geschirr", "#8ac63f"],
    ["product-soap.png", "Pflege", "#61a732"],
  ];

  return (
    <AbsoluteFill style={{background: "#f8fbf5", opacity}}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 16% 20%, rgba(97,167,50,0.2), transparent 28%), radial-gradient(circle at 82% 18%, rgba(226,0,122,0.16), transparent 24%)",
        }}
      />
      <AbsoluteFill style={{display: "grid", gridTemplateColumns: "0.76fr 1.24fr", gap: 54, padding: "110px 130px"}}>
        <div style={{alignSelf: "center", opacity: sceneIn(frame, start + 8)}}>
          <div style={{color: "#61a732", fontSize: 34, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase"}}>
            Produktnavigator
          </div>
          <div style={{color: "#111", fontSize: 102, fontWeight: 950, letterSpacing: "-0.07em", lineHeight: 0.92, marginTop: 28}}>
            Vier Produkte, sofort unterscheidbar
          </div>
          <div style={{color: "#5b6657", fontSize: 42, fontWeight: 650, lineHeight: 1.2, marginTop: 30}}>
            Statt abstrakter Oekologie zeigt der Slider konkrete Anwendungsmomente im Haushalt.
          </div>
        </div>
        <div style={{alignItems: "end", display: "flex", gap: 30, justifyContent: "center"}}>
          {products.map(([image, title, color], index) => (
            <div
              key={image}
              style={{
                alignItems: "center",
                background: "#fff",
                borderRadius: 34,
                boxShadow: "0 32px 80px rgba(42,92,22,0.14)",
                display: "grid",
                height: 650,
                opacity: sceneIn(frame, start + 12 + index * 8),
                padding: "32px 22px",
                scale: interpolate(frame, [start + 12 + index * 8, start + 38 + index * 8], [0.88, 1], clamp),
                width: 230,
              }}
            >
              <Img src={synergeticAsset(image)} style={{filter: "drop-shadow(0 24px 32px rgba(42,92,22,0.18))", height: 470, objectFit: "contain", width: "100%"}} />
              <div style={{color, fontSize: 30, fontWeight: 950, textAlign: "center"}}>{title}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SynergeticOriginalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 190;
  const end = 292;
  const opacity = sceneIn(frame, start) * sceneOut(frame, end);
  return (
    <AbsoluteFill style={{background: "#e9f5df", opacity}}>
      <KenBurnsImage resolver={synergeticAsset} src="hero.jpg" start={start} end={end} from={1.01} to={1.06} />
      <AbsoluteFill style={{background: "linear-gradient(90deg, rgba(20,54,12,0.52), rgba(20,54,12,0.18), rgba(20,54,12,0.08))"}} />
      <AbsoluteFill style={{justifyContent: "flex-end", padding: "0 130px 110px"}}>
        <div style={{opacity: sceneIn(frame, start + 8), maxWidth: 1040}}>
          <TextBlock
            body="Das Original liefert die Tonalitaet: Blatt, Produktfamilie, pinker Akzent und klare Produktversprechen."
            label="Originalscreen"
            title={<>100% Eco-Auftritt mit Produktfokus</>}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SynergeticFinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 274;
  const opacity = sceneIn(frame, start);
  return (
    <AbsoluteFill style={{background: "#f6fbf2", opacity}}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 20% 24%, rgba(97,167,50,0.28), transparent 28%), radial-gradient(circle at 78% 68%, rgba(226,0,122,0.18), transparent 30%)",
        }}
      />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", padding: "0 130px"}}>
        <div style={{alignItems: "center", display: "flex", flexDirection: "column", gap: 36, opacity: sceneIn(frame, start + 8), textAlign: "center"}}>
          <Img src={synergeticAsset("logo-small.png")} style={{height: 138, objectFit: "contain"}} />
          <div style={{color: "#111", fontSize: 104, fontWeight: 950, letterSpacing: "-0.07em", lineHeight: 0.92, maxWidth: 1120}}>
            From product detail to family trust
          </div>
          <div style={{color: "#5b6657", fontSize: 44, fontWeight: 650, lineHeight: 1.18, maxWidth: 920}}>
            Die Kampagne fuehrt vom Reiniger ueber Ratgeber und Contest bis zur Kaufentscheidung.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SynergeticReel: React.FC = () => {
  return (
    <AbsoluteFill style={{background: "#f6fbf2", fontFamily: "Inter, Arial, sans-serif"}}>
      <Sequence durationInFrames={112}>
        <SynergeticHeroScene />
      </Sequence>
      <Sequence durationInFrames={212}>
        <SynergeticProductsScene />
      </Sequence>
      <Sequence durationInFrames={300}>
        <SynergeticOriginalScene />
      </Sequence>
      <Sequence durationInFrames={360}>
        <SynergeticFinalScene />
      </Sequence>
    </AbsoluteFill>
  );
};

const BiottaHeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneIn(frame, 0) * sceneOut(frame, 98);
  return (
    <AbsoluteFill style={{background: "#f4f4ef", opacity}}>
      <KenBurnsImage resolver={biottaAsset} src="hero.jpg" start={0} end={112} from={1.01} to={1.06} />
      <AbsoluteFill
        style={{
          background: "linear-gradient(90deg, rgba(12,55,28,0.74), rgba(12,55,28,0.24) 46%, rgba(12,55,28,0.04))",
        }}
      />
      <AbsoluteFill style={{justifyContent: "center", padding: "0 130px"}}>
        <div
          style={{
            opacity: sceneIn(frame, 8),
            translate: `${interpolate(frame, [8, 34], [-50, 0], clamp)}px 0px`,
          }}
        >
          <TextBlock
            body="Elf Bio-Saefte werden nicht als Katalog gezeigt, sondern als ruhige Premium-Produktwelt mit Zutaten, Nutzen und Rezeptideen."
            label="Biotta · 2017"
            title={<>Vitamine und Geschmack das ganze Jahr</>}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BiottaSlidesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 90;
  const end = 214;
  const opacity = sceneIn(frame, start) * sceneOut(frame, end);
  const slides = [
    ["slide-lingonberry.jpg", "Preiselbeere", "#8f1234"],
    ["slide-carrot.jpg", "Karotte", "#d98519"],
    ["slide-pomegranate.jpg", "Granatapfel", "#b81435"],
  ];

  return (
    <AbsoluteFill style={{background: "#f7f7f3", opacity}}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 15% 18%, rgba(22,132,60,0.18), transparent 30%), radial-gradient(circle at 82% 80%, rgba(217,133,25,0.18), transparent 32%)",
        }}
      />
      <AbsoluteFill style={{display: "grid", gap: 50, gridTemplateColumns: "0.72fr 1.28fr", padding: "108px 130px"}}>
        <div style={{alignSelf: "center", opacity: sceneIn(frame, start + 8)}}>
          <div style={{color: "#16843c", fontSize: 34, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase"}}>
            Produktbuehnen
          </div>
          <div style={{color: "#101510", fontSize: 102, fontWeight: 950, letterSpacing: "-0.07em", lineHeight: 0.92, marginTop: 28}}>
            Jeder Geschmack bekommt seine eigene Szene
          </div>
          <div style={{color: "#58625b", fontSize: 42, fontWeight: 650, lineHeight: 1.2, marginTop: 30}}>
            Die Kampagne nutzt Wiedererkennung, aber variiert Farbe, Zutat und Produktnutzen pro Sorte.
          </div>
        </div>
        <div style={{alignItems: "center", display: "flex", gap: 24}}>
          {slides.map(([image, title, color], index) => (
            <div
              key={image}
              style={{
                background: "#fff",
                borderRadius: 34,
                boxShadow: "0 32px 80px rgba(20,35,22,0.14)",
                opacity: sceneIn(frame, start + 12 + index * 10),
                overflow: "hidden",
                scale: interpolate(frame, [start + 12 + index * 10, start + 42 + index * 10], [0.9, 1], clamp),
                width: 360,
              }}
            >
              <Img src={biottaAsset(image)} style={{height: 420, objectFit: "cover", objectPosition: "center", width: "100%"}} />
              <div style={{color, fontSize: 30, fontWeight: 950, padding: "24px 28px 28px"}}>{title}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BiottaRecipeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 200;
  const end = 300;
  const opacity = sceneIn(frame, start) * sceneOut(frame, end);
  return (
    <AbsoluteFill style={{background: "#f4f4ef", opacity}}>
      <KenBurnsImage resolver={biottaAsset} src="slide-vita7.jpg" start={start} end={end} from={1.01} to={1.07} />
      <AbsoluteFill style={{background: "linear-gradient(90deg, rgba(10,30,18,0.72), rgba(10,30,18,0.34), rgba(10,30,18,0.08))"}} />
      <AbsoluteFill style={{justifyContent: "flex-end", padding: "0 130px 110px"}}>
        <div style={{opacity: sceneIn(frame, start + 10)}}>
          <TextBlock
            body="Rezepte, Drinks und Wissen erweitern die Flasche vom Produkt zum Ritual."
            label="Anwendung"
            title={<>Vom Bio-Saft zum eigenen Drink</>}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BiottaFinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 274;
  const opacity = sceneIn(frame, start);
  return (
    <AbsoluteFill style={{background: "#f7f7f3", opacity}}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 18% 24%, rgba(22,132,60,0.2), transparent 28%), radial-gradient(circle at 82% 70%, rgba(143,18,52,0.16), transparent 30%)",
        }}
      />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", padding: "0 130px"}}>
        <div style={{alignItems: "center", display: "flex", flexDirection: "column", gap: 36, opacity: sceneIn(frame, start + 8), textAlign: "center"}}>
          <Img src={biottaAsset("logo.svg")} style={{height: 96, objectFit: "contain"}} />
          <div style={{color: "#101510", fontSize: 104, fontWeight: 950, letterSpacing: "-0.07em", lineHeight: 0.92, maxWidth: 1180}}>
            Premium product storytelling, not a simple juice list
          </div>
          <div style={{color: "#58625b", fontSize: 44, fontWeight: 650, lineHeight: 1.18, maxWidth: 980}}>
            Slider, Fakten, Rezepte und Community-Aktivierung arbeiten als ein klares Bio-System.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const BiottaReel: React.FC = () => {
  return (
    <AbsoluteFill style={{background: "#f7f7f3", fontFamily: "Inter, Arial, sans-serif"}}>
      <Sequence durationInFrames={112}>
        <BiottaHeroScene />
      </Sequence>
      <Sequence durationInFrames={224}>
        <BiottaSlidesScene />
      </Sequence>
      <Sequence durationInFrames={310}>
        <BiottaRecipeScene />
      </Sequence>
      <Sequence durationInFrames={360}>
        <BiottaFinalScene />
      </Sequence>
    </AbsoluteFill>
  );
};

const ScotchBriteHeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneIn(frame, 0) * sceneOut(frame, 98);
  return (
    <AbsoluteFill style={{background: "#f5f8f4", opacity}}>
      <KenBurnsImage resolver={scotchBriteAsset} src="hero-concept.jpg" start={0} end={112} from={1.01} to={1.07} />
      <AbsoluteFill
        style={{
          background: "linear-gradient(90deg, rgba(5,84,63,0.84), rgba(5,84,63,0.34) 48%, rgba(5,84,63,0.04))",
        }}
      />
      <AbsoluteFill style={{justifyContent: "center", padding: "0 130px"}}>
        <div
          style={{
            opacity: sceneIn(frame, 8),
            translate: `${interpolate(frame, [8, 34], [-50, 0], clamp)}px 0px`,
          }}
        >
          <TextBlock
            body="Scotch-Brite wird als freundlicher Guide fuer Planung, Kochen, Dekoration und Reinigung inszeniert."
            label="Scotch-Brite · 2017"
            title={<>Feiertage vorbereiten ohne Stress</>}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ScotchBriteTeamScene: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 90;
  const end = 206;
  const opacity = sceneIn(frame, start) * sceneOut(frame, end);
  return (
    <AbsoluteFill style={{background: "#06543f", opacity}}>
      <KenBurnsImage resolver={scotchBriteAsset} src="team-bg.jpg" start={start} end={end} from={1.01} to={1.06} />
      <AbsoluteFill style={{background: "linear-gradient(90deg, rgba(6,84,63,0.82), rgba(6,84,63,0.38), rgba(6,84,63,0.1))"}} />
      <AbsoluteFill style={{justifyContent: "center", padding: "0 130px"}}>
        <div style={{opacity: sceneIn(frame, start + 8), maxWidth: 980}}>
          <TextBlock
            body="Fuenf Rollen verwandeln Haushaltstipps in eine kleine Service-Redaktion fuer das Fest."
            label="Expertenteam"
            title={<>Der Story-Motor der Kampagne</>}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ScotchBriteModulesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 194;
  const end = 302;
  const opacity = sceneIn(frame, start) * sceneOut(frame, end);
  const modules = [
    ["video-01.jpg", "Video-Tipp", "How-to-Wissen fuer konkrete Situationen."],
    ["video-02.jpg", "Reinigung", "Kurze Module machen den Nutzen greifbar."],
    ["product-01.jpg", "Produkt", "Der Helfer bleibt nah an der Aufgabe."],
  ];

  return (
    <AbsoluteFill style={{background: "#f5f8f4", opacity}}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 16% 20%, rgba(184,240,79,0.22), transparent 28%), radial-gradient(circle at 84% 72%, rgba(11,127,91,0.18), transparent 30%)",
        }}
      />
      <AbsoluteFill style={{display: "grid", gap: 52, gridTemplateColumns: "0.76fr 1.24fr", padding: "110px 130px"}}>
        <div style={{alignSelf: "center", opacity: sceneIn(frame, start + 8)}}>
          <div style={{color: "#0b7f5b", fontSize: 34, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase"}}>
            Content-System
          </div>
          <div style={{color: "#0a1510", fontSize: 102, fontWeight: 950, letterSpacing: "-0.07em", lineHeight: 0.92, marginTop: 28}}>
            Videos, Produkte und Tipps in einem Ablauf
          </div>
          <div style={{color: "#53645c", fontSize: 42, fontWeight: 650, lineHeight: 1.2, marginTop: 30}}>
            Die Kampagne verkauft nicht isoliert. Sie hilft beim Gastgebermoment.
          </div>
        </div>
        <div style={{alignItems: "center", display: "flex", gap: 26}}>
          {modules.map(([image, title, text], index) => (
            <div
              key={image}
              style={{
                background: "#fff",
                borderRadius: 34,
                boxShadow: "0 32px 80px rgba(6,84,63,0.14)",
                opacity: sceneIn(frame, start + 12 + index * 10),
                overflow: "hidden",
                scale: interpolate(frame, [start + 12 + index * 10, start + 40 + index * 10], [0.9, 1], clamp),
                width: 340,
              }}
            >
              <Img src={scotchBriteAsset(image)} style={{height: 300, objectFit: "cover", width: "100%"}} />
              <div style={{padding: 28}}>
                <div style={{color: "#0b7f5b", fontSize: 30, fontWeight: 950}}>{title}</div>
                <div style={{color: "#53645c", fontSize: 26, fontWeight: 650, lineHeight: 1.22, marginTop: 12}}>{text}</div>
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ScotchBriteFinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 274;
  const opacity = sceneIn(frame, start);
  return (
    <AbsoluteFill style={{background: "#f5f8f4", opacity}}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 18% 24%, rgba(184,240,79,0.26), transparent 28%), radial-gradient(circle at 82% 70%, rgba(11,127,91,0.2), transparent 30%)",
        }}
      />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", padding: "0 130px"}}>
        <div style={{alignItems: "center", display: "flex", flexDirection: "column", gap: 36, opacity: sceneIn(frame, start + 8), textAlign: "center"}}>
          <Img src={scotchBriteAsset("logo.svg")} style={{height: 118, objectFit: "contain"}} />
          <div style={{color: "#0a1510", fontSize: 104, fontWeight: 950, letterSpacing: "-0.07em", lineHeight: 0.92, maxWidth: 1180}}>
            Cleaning becomes part of the party story
          </div>
          <div style={{color: "#53645c", fontSize: 44, fontWeight: 650, lineHeight: 1.18, maxWidth: 960}}>
            Der Case verbindet Service, Unterhaltung und Produktnutzen zu einem aktivierenden Content-Hub.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ScotchBriteReel: React.FC = () => {
  return (
    <AbsoluteFill style={{background: "#f5f8f4", fontFamily: "Inter, Arial, sans-serif"}}>
      <Sequence durationInFrames={112}>
        <ScotchBriteHeroScene />
      </Sequence>
      <Sequence durationInFrames={216}>
        <ScotchBriteTeamScene />
      </Sequence>
      <Sequence durationInFrames={310}>
        <ScotchBriteModulesScene />
      </Sequence>
      <Sequence durationInFrames={360}>
        <ScotchBriteFinalScene />
      </Sequence>
    </AbsoluteFill>
  );
};
