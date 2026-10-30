import { FSSAILicense, CommunityFeedback, TrustScoreBreakdown } from '../types';

export function calculateTrustScore(
  license?: FSSAILicense | null,
  feedbackList: CommunityFeedback[] = []
): TrustScoreBreakdown {
  const baseScore = 50;
  let licenseStatusAdjustment = 0;
  let licenseStatusReason = 'No license data found';
  let violationsAdjustment = 0;
  let violationsReason = 'No regulatory records';
  let communityAdjustment = 0;
  let communityReason = 'Insufficient community data (< 3 reports)';
  const recencyFactorAdjustment = 0;

  // 1. Regulatory Assessment
  if (!license || license.status === 'UNKNOWN') {
    licenseStatusAdjustment = 0;
    licenseStatusReason = 'License number unverified or not registered with FSSAI';
    violationsAdjustment = 0;
    violationsReason = 'No regulatory record accessible';
  } else {
    // License Status
    switch (license.status) {
      case 'ACTIVE':
        licenseStatusAdjustment = 20;
        licenseStatusReason = 'Active central/state FSSAI license';
        break;
      case 'EXPIRED':
        licenseStatusAdjustment = -10;
        licenseStatusReason = 'Expired FSSAI license (non-renewed)';
        break;
      case 'SUSPENDED':
      case 'CANCELLED':
        licenseStatusAdjustment = -25;
        licenseStatusReason = `${license.status} license due to safety or compliance action`;
        break;
    }

    // Violations Assessment
    const violations = license.violations || [];
    const highSeverityCount = violations.filter(
      (v) => v.severity === 'HIGH' || v.severity === 'CRITICAL'
    ).length;
    const totalViolations = violations.length;

    if (totalViolations === 0) {
      violationsAdjustment = 10;
      violationsReason = 'Clean regulatory record (0 official notices/recalls in 3 years)';
    } else if (highSeverityCount >= 1) {
      violationsAdjustment = -20;
      violationsReason = `${highSeverityCount} high-severity notice(s) or official recall(s) recorded`;
      if (totalViolations > 3) {
        violationsAdjustment -= 10;
        violationsReason += ' and multiple recurring notices (> 3)';
      }
    } else {
      violationsAdjustment = 0;
      violationsReason = `${totalViolations} minor/medium regulatory clarification(s) or inquiry`;
      if (totalViolations > 3) {
        violationsAdjustment -= 10;
        violationsReason += ' with recurring warning history';
      }
    }
  }

  // 2. Crowdsourced Feedback Assessment
  const totalFeedback = feedbackList.length;
  const seriousIssues = feedbackList.filter((f) => f.experienceType === 'SERIOUS_ISSUE').length;
  const minorIssues = feedbackList.filter((f) => f.experienceType === 'MINOR_ISSUE').length;
  const goodReports = feedbackList.filter((f) => f.experienceType === 'GOOD').length;

  if (totalFeedback >= 10) {
    const seriousRatio = seriousIssues / totalFeedback;
    if (seriousRatio < 0.05) {
      communityAdjustment = 10;
      communityReason = `High consumer satisfaction (${goodReports}/${totalFeedback} good, <5% serious issues)`;
    } else if (seriousRatio <= 0.2) {
      communityAdjustment = -5;
      communityReason = `Moderate issue rate (${(seriousRatio * 100).toFixed(0)}% serious incident reports)`;
    } else {
      communityAdjustment = -15;
      communityReason = `Elevated community incident rate (${(seriousRatio * 100).toFixed(0)}% serious reports)`;
    }
  } else if (totalFeedback >= 3) {
    if (seriousIssues > 0) {
      communityAdjustment = -5;
      communityReason = `${seriousIssues} serious consumer incident(s) reported (${totalFeedback} total reports)`;
    } else if (minorIssues > 0) {
      communityAdjustment = 0;
      communityReason = `Only minor packaging issues noted (${minorIssues}/${totalFeedback} reports)`;
    } else {
      communityAdjustment = 3;
      communityReason = `Positive initial community feedback (${goodReports}/${totalFeedback} reports)`;
    }
  } else {
    communityAdjustment = 0;
    communityReason = 'Insufficient community data (< 3 reports) – score relies primarily on regulatory records';
  }

  // Final score calculation
  const rawScore =
    baseScore +
    licenseStatusAdjustment +
    violationsAdjustment +
    communityAdjustment +
    recencyFactorAdjustment;

  const clampedScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Category determination
  let category: TrustScoreBreakdown['category'];
  let colorCode = 'slate';

  if (!license || license.status === 'UNKNOWN') {
    category = 'Insufficient Data';
    colorCode = 'slate';
  } else if (clampedScore >= 80) {
    category = 'High Trust';
    colorCode = 'emerald';
  } else if (clampedScore >= 60) {
    category = 'Medium Trust';
    colorCode = 'amber';
  } else if (clampedScore >= 40) {
    category = 'Low Trust';
    colorCode = 'orange';
  } else {
    category = 'Very Low Trust';
    colorCode = 'rose';
  }

  return {
    baseScore,
    licenseStatusAdjustment,
    licenseStatusReason,
    violationsAdjustment,
    violationsReason,
    communityAdjustment,
    communityReason,
    recencyFactorAdjustment,
    finalScore: clampedScore,
    category,
    colorCode,
  };
}
