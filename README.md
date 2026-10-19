# Yarmouk Climate & Health Risk Lab v2.7

Local static MVP for an illustrative environmental–health risk index informed by burden-of-disease evidence (GBD / Lancet Countdown), with modification coefficients and disease-impact mapping.

## v2.7 updates (scientific alignment)
- **Restructured calculation** into:
  - Base environmental risk weights (sum 100) informed by GBD/Lancet:
    - Air quality (PM2.5/AQI): 35%
    - Heat / climate extremes: 25%
    - Precipitation extremes: 12%
    - Humidity (modifier role): 8%
    - Health-indicator sensitivity: 10%
    - Other residual: 10%
  - Modification coefficients (not parallel weights):
    - Population vulnerability → amplification (1.0–1.5)
    - Exposure duration → amplification (1.0–1.25, 7-day cap)
    - Health-system capacity → mitigation (0.70–1.0)
- **Contribution breakdown** shown after calculation (base factors + modifiers).
- **Disease linking** expanded and graded by likelihood (high/moderate/lower):
  - Heat-related, cardiovascular, respiratory, COPD, kidney, diabetes
  - Diarrheal / water-borne and vector-borne (precipitation extremes)
  - Mental health and nutrition (vulnerability / capacity / extremes)
- Methodology, formula, terms table and bilingual texts updated to reflect burden-of-disease basis and modifier logic.
- Date range, checklist reference, privacy-first architecture, theme, language, sample, reset, print/PDF and live level indicators retained.

## Design principle
Environmental drivers receive base weights derived from attributable disease burden. Vulnerability, exposure duration and system capacity act as multipliers/mitigators rather than competing for the same 100 points. The health indicator is used for local sensitivity, not as a primary causal weight.

## Important
The index and condition mapping are an educational/prototype model. They are not a validated clinical score or official warning system. Weights and thresholds should be calibrated with local GBD estimates, surveillance data and meteorological series before operational or research use.

## Countries / context
Jordan (primary), Tunisia, Algeria, Lebanon, Yemen, UAE — consistent with the attached multi-country data availability & collection checklist.
