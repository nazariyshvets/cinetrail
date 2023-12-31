import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Engine } from "tsparticles-engine";

function StarryBackground() {
  async function particlesInit(engine: Engine) {
    await loadFull(engine);
  }

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fpsLimit: 60,
        particles: {
          shape: {
            type: "circle",
          },
          size: {
            random: {
              enable: true,
              minimumValue: 0.5,
            },
            value: 1.4,
          },
          color: {
            value: "#f1f1f1",
          },
          number: {
            density: {
              enable: true,
              area: 100,
            },
            limit: 0,
            value: 20,
          },
          opacity: {
            animation: {
              enable: true,
              minimumValue: 0.5,
              speed: 1.6,
              sync: false,
            },
            random: {
              enable: true,
              minimumValue: 0.1,
            },
            value: 1,
          },
          interactivity: {
            detectsOn: "canvas",
            events: {
              resize: true,
            },
          },
        },
      }}
    />
  );
}

export default StarryBackground;
