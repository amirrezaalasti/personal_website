import type profileJson from "@/data/profile.json";
import type projectsJson from "@/data/projects.json";
import type publicationsJson from "@/data/publications.json";
import type newsJson from "@/data/news.json";
import type certificatesJson from "@/data/certificates.json";

export type KnowledgeCategory =
  | "root"
  | "experience"
  | "education"
  | "project"
  | "publication"
  | "news"
  | "certificate"
  | "award"
  | "volunteering"
  | "tag"
  | "language"
  | "social";

export type GraphNode = {
  id: string;
  name: string;
  val: number;
  group: KnowledgeCategory;
};

export type GraphLink = { source: string; target: string };

export type NodeLink = { label: string; url: string };

export type NodeMeta = {
  id: string;
  category: KnowledgeCategory;
  title: string;
  subtitle?: string;
  body?: string;
  links?: NodeLink[];
};

export type KnowledgeGraphBundle = {
  nodes: GraphNode[];
  links: GraphLink[];
  nodeMetaById: Record<string, NodeMeta>;
  /** Flat list for list / a11y view (stable order) */
  exploreItems: { id: string; title: string; category: KnowledgeCategory }[];
};

function slug(s: string, max = 40): string {
  const base = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base.slice(0, max) || "item";
}

function dedupeLinks(links: GraphLink[]): GraphLink[] {
  const seen = new Set<string>();
  const out: GraphLink[] = [];
  for (const l of links) {
    const a = l.source < l.target ? l.source : l.target;
    const b = l.source < l.target ? l.target : l.source;
    const key = `${a}\0${b}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(l);
  }
  return out;
}

type Profile = typeof profileJson;
type Project = (typeof projectsJson)[number];
type Publication = (typeof publicationsJson)[number];
type NewsItem = (typeof newsJson)[number];
type Certificate = (typeof certificatesJson)[number];

export function buildKnowledgeGraph(input: {
  profile: Profile;
  projects: typeof projectsJson;
  publications: typeof publicationsJson;
  news: typeof newsJson;
  certificates: typeof certificatesJson;
}): KnowledgeGraphBundle {
  const { profile, projects, publications, news, certificates } = input;
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeMetaById: Record<string, NodeMeta> = {};
  const exploreItems: KnowledgeGraphBundle["exploreItems"] = [];

  const ME = "me";
  const rootLinks: NodeLink[] = [
    { label: "GitHub", url: profile.socials.github },
    { label: "LinkedIn", url: profile.socials.linkedin },
    { label: "Google Scholar", url: profile.socials.scholar },
  ];

  nodes.push({
    id: ME,
    name: profile.name,
    val: 22,
    group: "root",
  });
  nodeMetaById[ME] = {
    id: ME,
    category: "root",
    title: profile.name,
    subtitle: profile.headline,
    body: `${profile.about}\n\nLocation: ${profile.location}`,
    links: rootLinks,
  };
  exploreItems.push({ id: ME, title: profile.name, category: "root" });

  profile.experience.forEach((job, i) => {
    const id = `exp:${slug(job.company, 32)}:${i}`;
    nodes.push({ id, name: job.company, val: 10, group: "experience" });
    links.push({ source: ME, target: id });
    nodeMetaById[id] = {
      id,
      category: "experience",
      title: job.title,
      subtitle: `${job.company} · ${job.type} · ${job.period}`,
      body: `${job.location ? `${job.location}\n\n` : ""}${job.description}`,
    };
    exploreItems.push({ id, title: `${job.title} @ ${job.company}`, category: "experience" });
  });

  profile.education.forEach((edu, i) => {
    const id = `edu:${slug(edu.school, 32)}:${i}`;
    nodes.push({ id, name: edu.school, val: 9, group: "education" });
    links.push({ source: ME, target: id });
    const parts = [edu.degree, edu.period, edu.grade].filter(Boolean).join(" · ");
    nodeMetaById[id] = {
      id,
      category: "education",
      title: edu.school,
      subtitle: parts,
      body: "description" in edu && edu.description ? String(edu.description) : undefined,
    };
    exploreItems.push({ id, title: edu.school, category: "education" });
  });

  profile.awards.forEach((award, i) => {
    const id = `award:${slug(award.title, 24)}:${i}`;
    nodes.push({ id, name: award.title, val: 7, group: "award" });
    links.push({ source: ME, target: id });
    const linkList: NodeLink[] = [];
    if ("url" in award && typeof award.url === "string" && award.url) {
      linkList.push({ label: "Link", url: award.url });
    }
    nodeMetaById[id] = {
      id,
      category: "award",
      title: award.title,
      subtitle: `${award.issuer} · ${award.date}`,
      body: award.description,
      links: linkList.length ? linkList : undefined,
    };
    exploreItems.push({ id, title: award.title, category: "award" });
  });

  profile.volunteering.forEach((v, i) => {
    const id = `vol:${slug(v.organization, 28)}:${i}`;
    nodes.push({ id, name: v.organization, val: 6, group: "volunteering" });
    links.push({ source: ME, target: id });
    nodeMetaById[id] = {
      id,
      category: "volunteering",
      title: v.role,
      subtitle: `${v.organization} · ${v.date}`,
      body: v.description,
    };
    exploreItems.push({ id, title: `${v.role} — ${v.organization}`, category: "volunteering" });
  });

  profile.languages.forEach((lang, i) => {
    const id = `lang:${slug(lang.language, 16)}:${i}`;
    nodes.push({ id, name: lang.language, val: 5, group: "language" });
    links.push({ source: ME, target: id });
    nodeMetaById[id] = {
      id,
      category: "language",
      title: lang.language,
      subtitle: lang.proficiency,
    };
    exploreItems.push({ id, title: lang.language, category: "language" });
  });

  const tagSet = new Set<string>();
  projects.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));

  tagSet.forEach((tag) => {
    const id = `tag:${slug(tag, 36)}`;
    nodes.push({ id, name: tag, val: 4, group: "tag" });
    links.push({ source: ME, target: id });
    nodeMetaById[id] = {
      id,
      category: "tag",
      title: tag,
      subtitle: "Topic from projects",
      body: "Connected to every project that lists this tag.",
    };
    exploreItems.push({ id, title: tag, category: "tag" });
  });

  projects.forEach((p: Project, i) => {
    const id = `proj:${slug(p.title, 36)}:${i}`;
    nodes.push({ id, name: p.title.length > 42 ? `${p.title.slice(0, 40)}…` : p.title, val: 8, group: "project" });
    links.push({ source: ME, target: id });
    const plinks: NodeLink[] = (p.links ?? []).map((l) => ({
      label: l.type === "github" ? "Code" : l.type === "paper" ? "Paper" : "Link",
      url: l.url,
    }));
    nodeMetaById[id] = {
      id,
      category: "project",
      title: p.title,
      subtitle: p.tags.join(" · "),
      body: p.description,
      links: plinks.length ? plinks : undefined,
    };
    exploreItems.push({ id, title: p.title, category: "project" });
    p.tags.forEach((tag) => {
      const tid = `tag:${slug(tag, 36)}`;
      links.push({ source: id, target: tid });
    });
  });

  publications.forEach((pub: Publication, i) => {
    const id = `pub:${i}:${slug(pub.title, 24)}`;
    const short = pub.title.length > 48 ? `${pub.title.slice(0, 46)}…` : pub.title;
    nodes.push({ id, name: short, val: 7, group: "publication" });
    links.push({ source: ME, target: id });
    const plinks: NodeLink[] = [{ label: pub.linkLabel ?? "Link", url: pub.link }];
    if ("extraLinks" in pub && Array.isArray(pub.extraLinks)) {
      pub.extraLinks.forEach((ex: { label: string; url: string }) => plinks.push({ label: ex.label, url: ex.url }));
    }
    nodeMetaById[id] = {
      id,
      category: "publication",
      title: pub.title,
      subtitle: `${pub.venue} · ${pub.year}`,
      links: plinks,
    };
    exploreItems.push({ id, title: pub.title, category: "publication" });
  });

  news.forEach((item: NewsItem, i) => {
    const id = `news:${i}:${slug(item.title, 20)}`;
    nodes.push({
      id,
      name: item.title.length > 40 ? `${item.title.slice(0, 38)}…` : item.title,
      val: 6,
      group: "news",
    });
    links.push({ source: ME, target: id });
    nodeMetaById[id] = {
      id,
      category: "news",
      title: item.title,
      subtitle: item.date,
      body: item.content,
    };
    exploreItems.push({ id, title: item.title, category: "news" });
  });

  certificates.forEach((cert: Certificate, i) => {
    const id = `cert:${i}:${slug(cert.title, 20)}`;
    nodes.push({
      id,
      name: cert.title.length > 36 ? `${cert.title.slice(0, 34)}…` : cert.title,
      val: 5,
      group: "certificate",
    });
    links.push({ source: ME, target: id });
    const clinks: NodeLink[] =
      cert.link && cert.link !== "#" ? [{ label: "Credential", url: cert.link }] : [];
    nodeMetaById[id] = {
      id,
      category: "certificate",
      title: cert.title,
      subtitle: `${cert.issuer} · ${cert.date}`,
      links: clinks.length ? clinks : undefined,
    };
    exploreItems.push({ id, title: cert.title, category: "certificate" });
  });

  return {
    nodes,
    links: dedupeLinks(links),
    nodeMetaById,
    exploreItems,
  };
}
