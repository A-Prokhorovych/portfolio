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
