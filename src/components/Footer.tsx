const Footer = () => (
  <footer className="border-t border-border py-6 text-center space-y-1">
    <p className="font-pixel-body text-lg text-muted-foreground">
      🌿 GitGarden — Grow your code, grow your garden
    </p>
    <p className="font-pixel-body text-base text-muted-foreground">
      built by{" "}
      <a
        href="https://github.com/monicafidalgo"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-foreground transition-colors"
      >
        Mónica Fidalgo
      </a>
      {" · "}
      <a
        href="https://ko-fi.com/monicafidalgo"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-foreground transition-colors"
      >
        ☕ buy me a coffee
      </a>
      {" · "}
      <a
        href="https://github.com/MonicaFidalgo/git-garden/issues/new?template=feature_request.md&title=[Feature+Request]"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-foreground transition-colors"
      >
        💡 suggest a feature
      </a>
    </p>
  </footer>
);

export default Footer;
