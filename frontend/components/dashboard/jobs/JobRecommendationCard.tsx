"use client";

import {
  Building2,
  Briefcase,
  ExternalLink,
  MapPin,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { JobRecommendationRecord } from "@/lib/actions/job-recommendations";

interface JobRecommendationCardProps {
  recommendation: JobRecommendationRecord;
}

export default function JobRecommendationCard({
  recommendation,
}: JobRecommendationCardProps) {
  const scoreColor =
    recommendation.match_score >= 90
      ? "bg-green-100 text-green-700 border-green-200"
      : recommendation.match_score >= 75
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200";

  return (
    <Card className="rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500">
              <Building2 className="h-5 w-5" />
              <span className="font-medium">
                {recommendation.company}
              </span>
            </div>

            <CardTitle className="text-2xl">
              {recommendation.job_title}
            </CardTitle>
          </div>

          <Badge className={scoreColor}>
            <Star className="mr-1 h-3.5 w-3.5 fill-current" />
            {recommendation.match_score}% Match
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            <Briefcase className="mr-1 h-3.5 w-3.5" />
            {recommendation.employment_type}
          </Badge>

          <Badge variant="secondary">
            {recommendation.work_mode}
          </Badge>

          <Badge variant="outline">
            <MapPin className="mr-1 h-3.5 w-3.5" />
            {recommendation.location}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h4 className="mb-2 font-semibold">
            Job Description
          </h4>

          <p className="text-sm leading-6 text-slate-600">
            {recommendation.job_description}
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">
            Required Skills
          </h4>

          <div className="flex flex-wrap gap-2">
            {recommendation.required_skills.map((skill) => (
              <Badge
                key={skill}
                className="bg-green-50 text-green-700 hover:bg-green-100"
              >
                ✓ {skill}
              </Badge>
            ))}
          </div>
        </div>

        {recommendation.missing_skills.length > 0 && (
          <div>
            <h4 className="mb-3 font-semibold">
              Missing Skills
            </h4>

            <div className="flex flex-wrap gap-2">
              {recommendation.missing_skills.map((skill) => (
                <Badge
                  key={skill}
                  className="bg-red-50 text-red-700 hover:bg-red-100"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t pt-5">
          <span className="text-sm text-slate-500">
            Source: {recommendation.source}
          </span>

          <Button asChild>
            <a
              href={recommendation.apply_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
