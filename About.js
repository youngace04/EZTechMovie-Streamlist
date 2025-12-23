// src/components/About.jsx
export default function About() {
  return (
    <section className="stack-16">
      <div className="section-header">
        <h2>About EZTechMovie</h2>
        <p className="section-subtitle">Company profile</p>
      </div>

      <article className="card">
        <div className="card-body stack-12">
          <p className="card-meta"><strong>Company:</strong> EZTechMovie</p>
          <p className="card-meta"><strong>Type:</strong> Private video streaming company</p>
          <p className="card-meta"><strong>Location:</strong> San Diego, CA</p>
          <p className="card-meta"><strong>Employees:</strong> 7</p>
          <p className="card-meta"><strong>Annual Revenue:</strong> $1.5 million</p>

          <div className="stack-12">
            <p className="card-title">Leadership</p>
            <ul className="list">
              <li><strong>Pat Jones</strong> — Founder & CEO</li>
              <li><strong>Janet Simpson</strong> — CIO</li>
              <li><strong>Louis Martin</strong> — CISO</li>
            </ul>
          </div>
        </div>
      </article>
    </section>
  );
}
