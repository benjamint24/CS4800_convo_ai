function App() {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          Convo<span>AI</span>
        </div>
        <div>
          <button className="btn btn-secondary">Login</button>
          <button className="btn btn-primary" style={{ marginLeft: "1rem" }}>
            Get Started
          </button>
        </div>
      </nav>

      <section className="hero">
        <h1>
          Practice Spanish with{" "}
          <span className="highlight">AI Confidence</span>
        </h1>
        <p>
          Master real-world Spanish conversations in a judgment-free environment.
        </p>
      </section>
    </div>
  );
}

export default App;
