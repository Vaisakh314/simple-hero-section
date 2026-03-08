import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface Experience {
  title: string;
  company: string;
  period: string;
  highlights: string[];
}

interface Education {
  degree: string;
  school: string;
  year: string;
}

interface ResumeData {
  experience: Experience[];
  education: Education[];
  skills: string[];
  tools: string[];
}

const emptyExperience: Experience = { title: "", company: "", period: "", highlights: [""] };
const emptyEducation: Education = { degree: "", school: "", year: "" };

const defaultResume: ResumeData = {
  experience: [{ ...emptyExperience }],
  education: [{ ...emptyEducation }],
  skills: [""],
  tools: [""],
};

function parseResume(raw: string | undefined): ResumeData {
  if (!raw) return { ...defaultResume };
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.experience) return parsed;
  } catch {
    /* ignore */
  }
  return { ...defaultResume };
}

interface Props {
  value: string | undefined;
  onChange: (json: string) => void;
}

export default function ResumeEditor({ value, onChange }: Props) {
  const [data, setData] = useState<ResumeData>(() => parseResume(value));

  useEffect(() => {
    setData(parseResume(value));
  }, [value]);

  const emit = (next: ResumeData) => {
    setData(next);
    onChange(JSON.stringify(next));
  };

  // --- Experience ---
  const updateExp = (i: number, field: keyof Experience, val: string) => {
    const next = { ...data, experience: data.experience.map((e, idx) => idx === i ? { ...e, [field]: val } : e) };
    emit(next);
  };
  const updateHighlight = (ei: number, hi: number, val: string) => {
    const next = {
      ...data,
      experience: data.experience.map((e, idx) =>
        idx === ei ? { ...e, highlights: e.highlights.map((h, hidx) => hidx === hi ? val : h) } : e
      ),
    };
    emit(next);
  };
  const addHighlight = (ei: number) => {
    const next = {
      ...data,
      experience: data.experience.map((e, idx) =>
        idx === ei ? { ...e, highlights: [...e.highlights, ""] } : e
      ),
    };
    emit(next);
  };
  const removeHighlight = (ei: number, hi: number) => {
    const next = {
      ...data,
      experience: data.experience.map((e, idx) =>
        idx === ei ? { ...e, highlights: e.highlights.filter((_, hidx) => hidx !== hi) } : e
      ),
    };
    emit(next);
  };
  const addExperience = () => emit({ ...data, experience: [...data.experience, { ...emptyExperience, highlights: [""] }] });
  const removeExperience = (i: number) => emit({ ...data, experience: data.experience.filter((_, idx) => idx !== i) });

  // --- Education ---
  const updateEdu = (i: number, field: keyof Education, val: string) => {
    const next = { ...data, education: data.education.map((e, idx) => idx === i ? { ...e, [field]: val } : e) };
    emit(next);
  };
  const addEducation = () => emit({ ...data, education: [...data.education, { ...emptyEducation }] });
  const removeEducation = (i: number) => emit({ ...data, education: data.education.filter((_, idx) => idx !== i) });

  // --- Skills / Tools ---
  const updateList = (key: "skills" | "tools", i: number, val: string) => {
    const next = { ...data, [key]: data[key].map((s, idx) => idx === i ? val : s) };
    emit(next);
  };
  const addToList = (key: "skills" | "tools") => emit({ ...data, [key]: [...data[key], ""] });
  const removeFromList = (key: "skills" | "tools", i: number) => emit({ ...data, [key]: data[key].filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-8">
      {/* Experience */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-semibold text-foreground">Experience</h4>
          <Button type="button" variant="outline" size="sm" onClick={addExperience}>
            <Plus className="mr-1 h-3 w-3" /> Add Role
          </Button>
        </div>
        <div className="space-y-6">
          {data.experience.map((exp, ei) => (
            <div key={ei} className="relative rounded-lg border border-border bg-muted/20 p-4 space-y-3">
              {data.experience.length > 1 && (
                <Button type="button" variant="ghost" size="sm"
                  className="absolute right-2 top-2 text-destructive hover:text-destructive"
                  onClick={() => removeExperience(ei)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Job Title</Label>
                  <Input placeholder="e.g. Product Manager" value={exp.title} onChange={(e) => updateExp(ei, "title", e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Company</Label>
                  <Input placeholder="e.g. Acme Corp" value={exp.company} onChange={(e) => updateExp(ei, "company", e.target.value)} />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Time Period</Label>
                <Input placeholder="e.g. Jan 2020 – Present" value={exp.period} onChange={(e) => updateExp(ei, "period", e.target.value)} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Key Highlights</Label>
                  <Button type="button" variant="ghost" size="sm" className="h-6 text-xs" onClick={() => addHighlight(ei)}>
                    <Plus className="mr-1 h-3 w-3" /> Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {exp.highlights.map((h, hi) => (
                    <div key={hi} className="flex gap-2">
                      <Input
                        placeholder="e.g. Launched feature X, increasing engagement by 30%"
                        value={h}
                        onChange={(e) => updateHighlight(ei, hi, e.target.value)}
                        className="flex-1"
                      />
                      {exp.highlights.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" className="shrink-0 text-destructive hover:text-destructive"
                          onClick={() => removeHighlight(ei, hi)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-semibold text-foreground">Education</h4>
          <Button type="button" variant="outline" size="sm" onClick={addEducation}>
            <Plus className="mr-1 h-3 w-3" /> Add Education
          </Button>
        </div>
        <div className="space-y-4">
          {data.education.map((edu, i) => (
            <div key={i} className="relative rounded-lg border border-border bg-muted/20 p-4">
              {data.education.length > 1 && (
                <Button type="button" variant="ghost" size="sm"
                  className="absolute right-2 top-2 text-destructive hover:text-destructive"
                  onClick={() => removeEducation(i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Degree</Label>
                  <Input placeholder="e.g. B.Tech in CS" value={edu.degree} onChange={(e) => updateEdu(i, "degree", e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">School / University</Label>
                  <Input placeholder="e.g. MIT" value={edu.school} onChange={(e) => updateEdu(i, "school", e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Year</Label>
                  <Input placeholder="e.g. 2020" value={edu.year} onChange={(e) => updateEdu(i, "year", e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills & Tools side by side */}
      <div className="grid gap-8 sm:grid-cols-2">
        {(["skills", "tools"] as const).map((key) => (
          <div key={key}>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-semibold capitalize text-foreground">{key}</h4>
              <Button type="button" variant="outline" size="sm" onClick={() => addToList(key)}>
                <Plus className="mr-1 h-3 w-3" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {data[key].map((item, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder={key === "skills" ? "e.g. Product Discovery" : "e.g. Jira"}
                    value={item}
                    onChange={(e) => updateList(key, i, e.target.value)}
                    className="flex-1"
                  />
                  {data[key].length > 1 && (
                    <Button type="button" variant="ghost" size="sm" className="shrink-0 text-destructive hover:text-destructive"
                      onClick={() => removeFromList(key, i)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
