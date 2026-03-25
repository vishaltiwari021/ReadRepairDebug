import { highlights } from "../constants/content.js";
import { ArrowRight, Database, Server, RefreshCw } from "lucide-react";

function HeroSection() {
  return (
    <section className="hero bg-base-200 rounded-3xl overflow-hidden shadow-xl" id="overview">
      <div className="hero-content flex-col lg:flex-row-reverse p-8 lg:p-16 gap-12">
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="badge badge-primary badge-lg mb-2">System Snapshot</div>
          {highlights.map((item, i) => (
            <div key={item.title} className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body p-6">
                <h3 className="card-title text-lg flex items-center gap-2">
                  {i === 0 && <span className="text-secondary"><Database className="w-5 h-5"/></span>}
                  {i === 1 && <span className="text-accent"><RefreshCw className="w-5 h-5"/></span>}
                  {i === 2 && <span className="text-info"><Server className="w-5 h-5"/></span>}
                  {item.title}
                </h3>
                <p className="text-base-content/70 text-sm mt-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="w-full lg:w-1/2">
          <span className="text-primary font-bold tracking-wider text-sm uppercase mb-4 block">Read Repair Mechanism</span>
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Distributed consistency,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
               live frontend.
            </span>
          </h1>
          <p className="py-4 text-lg text-base-content/70 mb-8 max-w-lg">
            The interface is now organized into focused modules, with a dedicated API layer that connects the workspace directly to the backend read-repair service.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <a href="#workspace" className="btn btn-primary btn-lg rounded-full">
              Open Demo Workspace <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a href="#architecture" className="btn btn-outline btn-lg rounded-full">
              View Architecture
            </a>
          </div>
          
          <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100 border border-base-300 w-full">
            <div className="stat pb-6">
              <div className="stat-title">Cluster Size</div>
              <div className="stat-value text-primary text-3xl">3 Replicas</div>
              <div className="stat-desc">example topology</div>
            </div>
            <div className="stat pb-6">
              <div className="stat-title">Strategy</div>
              <div className="stat-value text-secondary text-3xl">On-demand</div>
              <div className="stat-desc">read repair triggered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
