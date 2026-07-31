/* Structured dataset derived from the radiology reports in data/scans-txt/.
   Every `text` below is a close paraphrase of the report wording; `quote` marks
   verbatim lines. Nothing here is a diagnosis — it is a re-presentation of what
   the reports already say. */

const SCANS = [
  { id: 's2014-08-21-ct',   date: '2014-08-21', modality: 'CT',    region: 'Brain',    title: 'CT head, with and without contrast', file: '2014-08-21_ct_brain.txt',
    impression: 'No acute intracranial hemorrhage. No enhancing lesions in the brain parenchyma.' },
  { id: 's2014-08-21-mri',  date: '2014-08-21', modality: 'MRI',   region: 'Brain',    title: 'MRI brain, stealth navigation protocol', file: '2014-08-21_mri_brain.txt',
    impression: 'Low-lying cerebellar tonsils. No acute intracranial abnormality.' },
  { id: 's2014-08-21-xr',   date: '2014-08-21', modality: 'X-ray', region: 'Cervical', title: 'X-ray cervical spine, 2 views', file: '2014-08-21_xray_spine.txt',
    impression: 'No acute osseous abnormality.' },
  { id: 's2014-08-26-ct',   date: '2014-08-26', modality: 'CT',    region: 'Brain',    title: 'CT head without contrast', file: '2014-08-26_ct_brain.txt',
    impression: 'Postoperative changes of suboccipital craniectomy for Chiari I malformation, with mild blood products and expected pneumocephalus.' },
  { id: 's2014-09-15-ct',   date: '2014-09-15', modality: 'CT',    region: 'Brain',    title: 'CT head without contrast', file: '2014-09-15_ct_brain.txt',
    impression: 'New 7 mm CSF-density subdural collection over the left convexity; fluid collection at the craniectomy site, possibly a postoperative CSF leak.' },
  { id: 's2014-09-16-mri',  date: '2014-09-16', modality: 'MRI',   region: 'Brain',    title: 'MRI brain, with and without contrast', file: '2014-09-16_mri_brain.txt',
    impression: 'Rim-enhancing 6 × 4.3 × 9 cm collection at the craniectomy site — pseudomeningocele vs. seroma; bilateral subdural hygromas; diffuse dural enhancement.' },
  { id: 's2015-02-14-mrib', date: '2015-02-14', modality: 'MRI',   region: 'Brain',    title: 'MRI brain, with and without contrast', file: '2015-02-14_mri_brain.txt',
    impression: 'Resolution of the previous fluid collection / meningocele. No significant brain finding.' },
  { id: 's2015-02-14-mric', date: '2015-02-14', modality: 'MRI',   region: 'Cervical', title: 'MRI cervical spine, with and without contrast', file: '2015-02-14_mri_spine.txt',
    impression: 'A few minor degenerative findings, not significant. The postoperative suboccipital fluid has resolved, leaving scar only.' },
  { id: 's2015-04-29-mri',  date: '2015-04-29', modality: 'MRI',   region: 'Lumbar',   title: 'MRI lumbar spine, without contrast', file: '2015-04-29_mri_spine.txt',
    impression: 'Degenerative change at L4-L5 with a focal disc extrusion effacing the left lateral recess and the left L5 nerve. Moderate left foraminal narrowing. No central canal stenosis.' },
  { id: 's2016-04-07-mric', date: '2016-04-07', modality: 'MRI',   region: 'Cervical', title: 'MRI cervical spine, without contrast', file: '2016-04-07_mri_spine.txt',
    impression: 'Mild degenerative change in the lower cervical spine. Modic 1 endplate changes at C6-7 have progressed since 2015; the small disc bulge appears stable.' },
  { id: 's2016-04-07-mrib', date: '2016-04-07', modality: 'MRI',   region: 'Brain',    title: 'MRI brain, with and without contrast', file: '2016_04_07_mri_bran.txt',
    impression: 'Stable MRI of the brain. Status post suboccipital decompression with good postoperative appearance. Otherwise normal.' },
  { id: 's2016-05-12-mri',  date: '2016-05-12', modality: 'MRI',   region: 'Lumbar',   title: 'MRI lumbar spine, with and without contrast', file: '2016-05-12_mri-spine.txt',
    impression: 'Good postoperative appearance at L4-5 after left laminotomy and microdiscectomy. Improved disc herniation, no new herniation or significant scarring. Mild scoliosis.' },
  { id: 's2017-08-15-xr',   date: '2017-08-15', modality: 'X-ray', region: 'Lumbar',   title: 'X-ray lumbosacral spine, 5 views with flexion / extension', file: '2017-08-15_xray_spine.txt',
    impression: 'Levoscoliosis. Degenerative disc disease at L4-5.' },
  { id: 's2025-08-11-xr',   date: '2025-08-11', modality: 'X-ray', region: 'Full spine', title: 'X-ray scoliosis survey and lumbar spine, standing', file: '2025-08-11_xray_spine.txt',
    impression: 'Sigmoid curvature of the thoracolumbar spine with minimal right-sided superior pelvic tilt. Multilevel disc degeneration and facet arthrosis. No instability.' },
  { id: 's2025-preop-mric', date: '2025-08-19', modality: 'MRI',   region: 'Cervical', title: 'MRI cervical spine, without contrast (pre-operative)', file: '2025-08-19_mri_spine.txt',
    impression: 'Multilevel degenerative change, greatest at C5-C6 with moderate canal stenosis and severe bilateral foraminal narrowing. No cord edema or myelomalacia.' },
  { id: 's2025-08-25-xr',   date: '2025-08-25', modality: 'X-ray', region: 'Cervical', title: 'X-ray cervical spine, flexion / extension', file: '2025-08-25_xray-cervical.txt',
    impression: 'Interval development of severe degenerative disc changes in the lower cervical spine compared with 2014.' },
  { id: 's2025-11-22-xr',   date: '2025-11-22', modality: 'X-ray', region: 'Cervical', title: 'X-ray cervical spine, standing (post-operative)', file: '2025-11-25_xray-cervical.txt',
    impression: 'Status post disc arthroplasty at C5-6 and C6-7; hardware intact.' },
  { id: 's2026-01-06-xr',   date: '2026-01-06', modality: 'X-ray', region: 'Cervical', title: 'X-ray cervical spine, 4-5 views with flexion / extension', file: '2026-01-06_xray-spine.txt',
    impression: 'Stable disc arthroplasties at C5-6 and C6-7. Disc disease at C4-5. No instability with flexion or extension.' },
  { id: 's2026-02-07-mri',  date: '2026-02-07', modality: 'MRI',   region: 'Lumbar',   title: 'MRI lumbar spine, with and without contrast', file: '2026-02-07_mri-spine.txt',
    impression: 'Interval slight increase in size of the left L4-5 subarticular / foraminal disc protrusion. Otherwise relatively stable.' },
  { id: 's2026-02-17-xrc',  date: '2026-02-17', modality: 'X-ray', region: 'Cervical', title: 'X-ray cervical spine, 4-5 views with flexion / extension', file: '2026-02-17_xray-cervical.txt',
    impression: 'Stable disc arthroplasties C5-C6 and C6-C7. No instability on flexion or extension.' },
  { id: 's2026-02-17-xrl',  date: '2026-02-17', modality: 'X-ray', region: 'Lumbar',   title: 'X-ray lumbar spine, 4+ views with flexion / extension', file: '2026-02-17_xray-spine.txt',
    impression: 'Stable degenerative disc disease and facet arthrosis of the lower lumbar spine. Levoscoliosis. No instability.' },
  { id: 's2026-04-13-xr',   date: '2026-04-13', modality: 'X-ray', region: 'Cervical', title: 'X-ray cervical spine, 4-5 views with flexion / extension', file: '2026-04-13_xray_spine.txt',
    impression: 'Unchanged appearance of C5-C7 disc arthroplasty hardware. No instability.' },
  { id: 's2026-07-14-mri',  date: '2026-07-14', modality: 'MRI',   region: 'Lumbar',   title: 'MRI lumbar spine, with and without contrast', file: '2026-07-14_mri-spine_.txt',
    impression: 'Interval increased size of the left L4-5 disc protrusion and interval left L5 hemilaminotomy / discectomy. Spine surgery follow-up recommended.' }
];

/* Operative dates supplied by the patient. None of them appear in the radiology
   reports, which only ever describe surgery in the past tense — so this is the one
   part of the record the imaging could not have told us. */
const SURGERIES = [
  { date: '2014-08-26', label: 'Suboccipital craniectomy — Chiari I decompression', levels: ['ccj'],
    note: 'A C1 laminectomy was not performed, which the 2016 MRI notes explicitly. The same-day CT shows the expected pneumocephalus and a little blood at the craniectomy site.' },
  { date: '2014-09-18', label: 'Second posterior fossa operation', levels: ['ccj'],
    note: 'Two days after the MRI that found a 6 × 4.3 × 9 cm rim-enhancing collection at the craniectomy site, a possible CSF leak and bilateral subdural hygromas. The radiology record never names this procedure — it only shows the problem before it and the resolution after it.' },
  { date: '2015-05-13', label: 'Left L4-5 laminotomy and microdiscectomy', levels: ['l4-l5'],
    note: 'Two weeks after the MRI that found the disc extrusion sitting on the left L5 nerve. The MRI a year later called it a good post-operative result.' },
  { date: '2025-11-21', label: 'C5-6 and C6-7 total disc arthroplasty (disc replacement)', levels: ['c5-c6', 'c6-c7'],
    note: 'For myeloradiculopathy and kyphosis. The standing x-ray the following day found the hardware intact and aligned, and it has been unchanged on every film since.' },
  { date: '2026-05-21', label: 'Left L5 hemilaminotomy and discectomy', levels: ['l5-s1'],
    note: 'The MRI eight weeks later found a small left foraminal disc protrusion still contacting the exiting left L5 nerve root.' }
];

/* severity: normal | mild | moderate | severe.  surgical: hardware or prior surgery at this level.
   canal: relative spinal-canal narrowing at this level, drives the canal ribbon width. */
const LEVELS = [
  {
    id: 'ccj', label: 'Craniocervical junction', sub: 'Posterior fossa', region: 'cranial',
    severity: 'mild', surgical: true, canal: 'normal',
    status: 'Two operations in 2014 · stable since 2015',
    summary: 'Chiari I malformation — the cerebellar tonsils sat 7 mm below the foramen magnum — decompressed by suboccipital craniectomy on 26 August 2014. Three weeks later the imaging had turned: a 6 × 4.3 × 9 cm rim-enhancing collection at the craniectomy site, a possible CSF leak, and subdural hygromas over both hemispheres. A second operation followed on 18 September. That settled it — by February 2015 the collection had resolved, leaving scar tissue only, and every scan since has been stable.',
    metrics: [
      ['Tonsillar descent (2014, pre-op)', '7 mm below foramen magnum'],
      ['First operation', '26 Aug 2014 — suboccipital craniectomy, no C1 laminectomy'],
      ['Second operation', '18 Sep 2014 — for the post-operative collection'],
      ['Time between them', '23 days'],
      ['Latest assessment', 'Intracranial contents unremarkable (Aug 2025)']
    ],
    findings: [
      { scan: 's2014-08-21-mri', severity: 'moderate', text: 'Low-lying cerebellar tonsils protruding 7 mm below the foramen magnum. No other acute intracranial abnormality.', quote: 'Low-lying cerebellar tonsils protrude 7 mm below the foramen magnum.' },
      { scan: 's2014-08-21-ct', severity: 'normal', text: 'Pre-operative navigation CT. No hemorrhage, mass lesion or midline shift; ventricles normal.' },
      { scan: 's2014-08-26-ct', severity: 'moderate', event: 'post-op', text: 'Immediately after suboccipital craniectomy: expected pneumocephalus in the posterior fossa and right frontal region, small blood products in the craniectomy site, trace fluid in the resection bed. No significant mass effect.' },
      { scan: 's2014-09-15-ct', severity: 'severe', text: 'Three weeks post-op: new CSF-density subdural collection up to 7 mm over the left cerebral convexity and beneath the tentorium, with slight mass effect but no midline shift. A 2.8 × 5.1 cm fluid collection along the craniectomy site, possibly a CSF leak. Pneumocephalus had resolved.' },
      { scan: 's2014-09-16-mri', severity: 'severe', text: 'Collection at the craniectomy site now measured 6 × 4.3 × 9 cm with rim enhancement — pseudomeningocele, seroma, or infection could not be separated by imaging. Bilateral holohemispheric subdural hygromas along the tentorium and falx. Diffuse dural enhancement, raising reactive change vs. intracranial hypotension vs. infection.' },
      { scan: 's2015-02-14-mrib', severity: 'mild', event: 'post-op', text: 'The first imaging after the second operation, five months on: the fluid space has resolved, with scar in that region. Posterior fossa structures normal; ventricles, cisterns and enhancement all normal.' },
      { scan: 's2015-02-14-mric', severity: 'mild', text: 'From the cervical study: the seroma is no longer visible, scarring in the suboccipital region. Cerebellar tonsils and brainstem are not deformed. Foramen magnum intact.' },
      { scan: 's2016-04-07-mrib', severity: 'mild', text: 'Stable decompression, no fluid collection, good post-operative appearance overall. Otherwise a normal brain MRI.' },
      { scan: 's2016-04-07-mric', severity: 'mild', text: 'Posterior incision well healed with no significant fluid collection. Noted that a C1 laminectomy was not performed as part of the decompression.' },
      { scan: 's2025-preop-mric', severity: 'mild', text: 'Visualized intracranial contents unremarkable. No focal cervical cord lesions.' }
    ]
  },
  {
    id: 'c1-c2', label: 'C1-C2', sub: 'Atlantoaxial joint', region: 'cervical',
    severity: 'normal', surgical: false, canal: 'normal',
    status: 'Normal throughout',
    summary: 'The atlantoaxial joint has been reported normal on every study from 2014 to the present, including flexion / extension views specifically looking for instability.',
    metrics: [['Atlantodens interval', 'Unchanged since 2014'], ['Canal', 'No significant stenosis']],
    findings: [
      { scan: 's2014-08-21-xr', severity: 'normal', text: 'Seven cervical vertebral bodies in anatomic alignment; vertebral body heights maintained; spinal canal within normal limits.' },
      { scan: 's2016-04-07-mric', severity: 'normal', text: 'Atlanto-axial relationship within normal limits. Craniocervical junction within normal limits.' },
      { scan: 's2025-08-25-xr', severity: 'normal', text: 'No development of spondylolisthesis and no change in the atlantodens interval on flexion and extension.' },
      { scan: 's2025-preop-mric', severity: 'normal', text: 'No significant spinal canal stenosis or neural foraminal narrowing.' }
    ]
  },
  {
    id: 'c2-c3', label: 'C2-C3', sub: 'Cervical disc', region: 'cervical',
    severity: 'mild', surgical: false, canal: 'mild',
    status: 'Mild, progressed since 2016',
    summary: 'Clean on the 2016 MRI. By the pre-operative 2025 study it had developed mild facet hypertrophy with mild canal stenosis and mild narrowing of both nerve exits — a small but real change.',
    metrics: [['Canal', 'Mild stenosis'], ['Foramina', 'Mild, both sides'], ['Trend', 'Progressed since 2016']],
    findings: [
      { scan: 's2016-04-07-mric', severity: 'normal', text: 'No significant disc herniation, cervical stenosis, or foraminal stenosis.' },
      { scan: 's2025-preop-mric', severity: 'mild', text: 'Mild facet hypertrophy with mild spinal canal stenosis and mild bilateral neuroforaminal narrowing — progressed compared with the prior study.' }
    ]
  },
  {
    id: 'c3-c4', label: 'C3-C4', sub: 'Cervical disc', region: 'cervical',
    severity: 'moderate', surgical: false, canal: 'mild',
    status: 'Moderate foraminal narrowing, progressed',
    summary: 'Normal in 2016. Now carries a 3 mm posterior disc-osteophyte complex with mild canal stenosis and moderate narrowing of both nerve exits. Untreated and progressing.',
    metrics: [['Disc-osteophyte complex', '3 mm, posterior'], ['Canal', 'Mild stenosis'], ['Foramina', 'Moderate, both sides'], ['Trend', 'Progressed since 2016']],
    findings: [
      { scan: 's2016-04-07-mric', severity: 'normal', text: 'No significant disc herniation, cervical stenosis, or foraminal stenosis.' },
      { scan: 's2025-preop-mric', severity: 'moderate', text: '3 mm posterior disc-osteophyte complex with associated mild spinal canal stenosis. Facet hypertrophy with moderate bilateral neuroforaminal narrowing. Findings have progressed compared with the prior study.' }
    ]
  },
  {
    id: 'c4-c5', label: 'C4-C5', sub: 'Cervical disc · above the arthroplasty', region: 'cervical',
    severity: 'moderate', surgical: false, canal: 'mild',
    status: 'Moderate · the level to watch',
    summary: 'The level immediately above the two disc replacements, and the only cervical level that has been called out as changing since the surgery. Normal in 2016; a 3 mm disc-osteophyte complex with moderate right-sided foraminal narrowing by 2025; and disc height loss newly described on the January and February 2026 x-rays.',
    metrics: [['Disc-osteophyte complex', '3 mm, posterior'], ['Canal', 'Mild stenosis'], ['Foramina', 'Moderate right, mild left'], ['Relation to hardware', 'Adjacent level, above C5-6 arthroplasty']],
    findings: [
      { scan: 's2016-04-07-mric', severity: 'normal', text: 'No significant disc herniation, cervical stenosis, or foraminal stenosis.' },
      { scan: 's2025-preop-mric', severity: 'moderate', text: '3 mm posterior disc-osteophyte complex with mild canal stenosis. Facet hypertrophy with moderate right-sided and mild left-sided neuroforaminal narrowing — progressed compared with the prior study.' },
      { scan: 's2026-01-06-xr', severity: 'moderate', text: 'Disc disease at C4-5, named separately from the stable arthroplasty levels.' },
      { scan: 's2026-02-17-xrc', severity: 'moderate', text: 'Disc height loss at C4-C5. Straightening of the normal cervical lordosis.' },
      { scan: 's2026-04-13-xr', severity: 'moderate', text: 'Disc spaces stable; no instability on flexion or extension.' }
    ]
  },
  {
    id: 'c5-c6', label: 'C5-C6', sub: 'Total disc replacement', region: 'cervical',
    severity: 'mild', surgical: true, canal: 'normal',
    status: 'Replaced Nov 2025 · stable',
    summary: 'The worst cervical level, and the reason for surgery. A minor bulge in 2015 became a 4 mm disc-osteophyte complex with the canal squeezed to 7 mm and severe narrowing of both nerve exits by 2025 — with myelopathy symptoms but, importantly, no cord signal change. Replaced with an artificial disc in November 2025; every x-ray since has called the hardware intact and stable.',
    metrics: [['Pre-op canal diameter', '7 mm (moderate stenosis)'], ['Pre-op foramina', 'Severe, both sides'], ['Cord', 'No edema or myelomalacia'], ['Current', 'Disc arthroplasty (21 Nov 2025), intact and aligned']],
    findings: [
      { scan: 's2014-08-21-xr', severity: 'normal', text: 'Disc spaces unremarkable; facet joints anatomically aligned.' },
      { scan: 's2015-02-14-mric', severity: 'mild', text: 'Minor disc bulge at the C5-6 level. Spinal cord normal; no abnormal enhancement.' },
      { scan: 's2016-04-07-mric', severity: 'mild', text: 'Mild disc degenerative changes. No significant disc herniation, cervical stenosis, or foraminal stenosis.' },
      { scan: 's2025-08-25-xr', severity: 'severe', text: 'Degenerative disc changes, predominantly C5-6 and C6-7, new since the 2014 study. Read as interval development of severe degenerative disc disease in the lower cervical spine.' },
      { scan: 's2025-preop-mric', severity: 'severe', text: '4 mm posterior disc-osteophyte complex with moderate spinal canal stenosis, AP diameter down to 7 mm. Facet hypertrophy with severe bilateral neural foraminal narrowing. Moderate disc space narrowing with mixed Modic endplate changes and an anterior endplate osteophyte. No evidence of cord edema or myelomalacia.' },
      { scan: 's2025-11-22-xr', severity: 'mild', event: 'post-op', text: 'Newly visualized disc arthroplasty hardware at C5-6, intact and appropriately aligned. Prevertebral soft tissue edema, gas and a surgical drain — expected immediately post-op.' },
      { scan: 's2026-01-06-xr', severity: 'mild', text: 'Arthroplasty redemonstrated with stable alignment. Drain removed. No instability with flexion or extension.' },
      { scan: 's2026-02-17-xrc', severity: 'mild', text: 'Stable disc arthroplasty. Vertebral body heights maintained, spinal canal within normal limits, no instability.' },
      { scan: 's2026-04-13-xr', severity: 'mild', text: 'Unchanged appearance of the C5-C7 arthroplasty hardware. No instability.' }
    ]
  },
  {
    id: 'c6-c7', label: 'C6-C7', sub: 'Total disc replacement', region: 'cervical',
    severity: 'mild', surgical: true, canal: 'normal',
    status: 'Replaced Nov 2025 · stable',
    summary: 'The longest-running cervical finding: a small central disc extrusion was already there in 2015, and the Modic endplate changes were noted as progressing in 2016 — nine years before surgery. By 2025 the canal was down to 8 mm with moderate-to-severe foraminal narrowing. Replaced alongside C5-6 in November 2025 and stable since.',
    metrics: [['First seen', '2015 — small central disc extrusion'], ['Pre-op canal diameter', '8 mm (mild-to-moderate stenosis)'], ['Pre-op foramina', 'Moderate to severe, both sides'], ['Current', 'Disc arthroplasty (21 Nov 2025), intact and aligned']],
    findings: [
      { scan: 's2015-02-14-mric', severity: 'mild', text: 'Small central disc extrusion extending slightly above the interspace, a few millimetres, not associated with major stenosis.', quote: 'There is a small central disc extrusion at the C6-7 level.' },
      { scan: 's2016-04-07-mric', severity: 'moderate', text: 'Disc degenerative changes with mild bulging, stable since 2015, but the Modic 1 reactive endplate signal changes have progressed. Slight central canal narrowing without cord compression; nerve root foramina remain patent.' },
      { scan: 's2025-08-25-xr', severity: 'severe', text: 'Degenerative disc changes, predominantly C5-6 and C6-7, new since 2014 — read as severe.' },
      { scan: 's2025-preop-mric', severity: 'severe', text: '3 mm posterior disc-osteophyte complex with mild-to-moderate spinal canal stenosis, AP diameter down to 8 mm. Facet hypertrophy with moderate-to-severe bilateral neural foraminal narrowing.' },
      { scan: 's2025-11-22-xr', severity: 'mild', event: 'post-op', text: 'Newly visualized disc arthroplasty hardware at C6-7, intact and appropriately aligned.' },
      { scan: 's2026-01-06-xr', severity: 'mild', text: 'Redemonstrated with stable alignment; no instability with flexion or extension.' },
      { scan: 's2026-02-17-xrc', severity: 'mild', text: 'Stable disc arthroplasty; no instability on flexion or extension.' },
      { scan: 's2026-04-13-xr', severity: 'mild', text: 'Unchanged hardware appearance. No instability.' }
    ]
  },
  {
    id: 'c7-t1', label: 'C7-T1', sub: 'Cervicothoracic junction', region: 'cervical',
    severity: 'mild', surgical: false, canal: 'mild',
    status: 'Mild, slowly progressing',
    summary: 'A small right-sided protrusion in 2015 that has grown into a 4 mm disc-osteophyte complex — the largest in the cervical spine by measurement — but it sits in a roomier canal, so it only causes mild stenosis and the nerve exits stay open.',
    metrics: [['Disc-osteophyte complex', '4 mm, posterior'], ['Canal diameter', '9 mm (mild stenosis)'], ['Foramina', 'No significant narrowing']],
    findings: [
      { scan: 's2015-02-14-mric', severity: 'mild', text: 'Small disc protrusion measuring one to two millimetres on the right.' },
      { scan: 's2016-04-07-mric', severity: 'mild', text: 'Mild degenerative changes. No significant disc herniation, cervical stenosis, or foraminal stenosis.' },
      { scan: 's2025-preop-mric', severity: 'mild', text: '4 mm posterior disc-osteophyte complex with associated mild spinal canal stenosis, AP diameter up to 9 mm. Facet hypertrophy without significant neuroforaminal narrowing.' }
    ]
  },
  {
    id: 't10-t11', label: 'T10-T11', sub: 'Thoracic disc', region: 'thoracic',
    severity: 'mild', surgical: false, canal: 'normal',
    status: 'Incidental bulge, 2015',
    summary: 'Seen only at the edge of a lumbar MRI in 2015 and never followed up, because no scan since has covered it properly. A bulge with no stenosis.',
    metrics: [['Seen on', 'Edge of the 2015 lumbar MRI'], ['Stenosis', 'None'], ['Follow-up', 'Not re-imaged']],
    findings: [
      { scan: 's2015-04-29-mri', severity: 'mild', text: 'Partially visualized disc bulge at T10-T11 which does not cause any spinal stenosis.', quote: 'Partially visualized is a disc bulge at T10-T11 level which does not cause any spinal stenosis.' }
    ]
  },
  {
    id: 'l1-l2', label: 'L1-L2', sub: 'Lumbar disc', region: 'lumbar',
    severity: 'mild', surgical: false, canal: 'normal',
    status: 'Disc drying out, no compression',
    summary: 'Clean on both 2015 and 2016 MRIs. The 2026 studies describe disc desiccation across L1 to L3 — the disc losing water content — without any herniation, stenosis or nerve involvement.',
    metrics: [['Disc signal', 'Desiccated (2026)'], ['Canal', 'No stenosis'], ['Foramina', 'Patent']],
    findings: [
      { scan: 's2015-04-29-mri', severity: 'normal', text: 'No disc herniation, central spinal stenosis, or foraminal compromise.' },
      { scan: 's2016-05-12-mri', severity: 'normal', text: 'No disc herniation, central spinal stenosis, or foraminal compromise.' },
      { scan: 's2026-02-07-mri', severity: 'mild', text: 'L1-3 disc desiccation. Vertebral body heights preserved. No canal stenosis at this level.' },
      { scan: 's2026-07-14-mri', severity: 'mild', text: 'L1-3 disc desiccation, unchanged. Neuroforaminal narrowing unchanged relative to the prior MRI.' }
    ]
  },
  {
    id: 'l2-l3', label: 'L2-L3', sub: 'Lumbar disc · scoliosis apex', region: 'lumbar',
    severity: 'mild', surgical: false, canal: 'normal',
    status: 'Disc drying out · apex of the lumbar curve',
    summary: 'Same picture as L1-L2 — desiccation without compression — but this is also the vertex of the 20-degree leftward lumbar curve, which the 2026 x-ray calls unchanged.',
    metrics: [['Disc signal', 'Desiccated (2026)'], ['Scoliosis', 'Curve centred at L2, Cobb 20°'], ['Canal', 'No stenosis']],
    findings: [
      { scan: 's2015-04-29-mri', severity: 'normal', text: 'No disc herniation, central spinal stenosis, or foraminal compromise.' },
      { scan: 's2016-05-12-mri', severity: 'normal', text: 'No disc herniation, central spinal stenosis, or foraminal compromise. Mild scoliosis noted.' },
      { scan: 's2026-02-07-mri', severity: 'mild', text: 'L1-3 disc desiccation. Mild scoliosis without spondylolisthesis.' },
      { scan: 's2026-02-17-xrl', severity: 'mild', text: 'Levoscoliosis centred at L2 appears unchanged. No instability with flexion or extension.' }
    ]
  },
  {
    id: 'l3-l4', label: 'L3-L4', sub: 'Lumbar disc', region: 'lumbar',
    severity: 'mild', surgical: false, canal: 'normal',
    status: 'Mild — facet arthrosis begins here',
    summary: 'The upper boundary of the arthritic lower lumbar spine. Normal through 2016; by 2025 the facet arthrosis is described as greatest from this level downward, with mild right-sided foraminal narrowing on MRI.',
    metrics: [['Facets', 'Arthrosis greatest from here down'], ['Foramina', 'Mild, right'], ['Canal', 'No stenosis']],
    findings: [
      { scan: 's2015-04-29-mri', severity: 'normal', text: 'No disc herniation, central spinal stenosis, or foraminal compromise.' },
      { scan: 's2016-05-12-mri', severity: 'normal', text: 'No disc herniation, central spinal stenosis, or foraminal compromise.' },
      { scan: 's2025-08-11-xr', severity: 'mild', text: 'Facet arthrosis appears greatest from L3-4 inferiorly. Multilevel endplate osteophytosis.' },
      { scan: 's2026-02-07-mri', severity: 'mild', text: 'Mild right L3-4 neural foraminal narrowing.' },
      { scan: 's2026-07-14-mri', severity: 'mild', text: 'Neuroforaminal narrowing unchanged relative to the prior MRI.' }
    ]
  },
  {
    id: 'l4-l5', label: 'L4-L5', sub: 'Lumbar disc · operated 2015', region: 'lumbar',
    severity: 'severe', surgical: true, canal: 'mild',
    status: 'Severe · protrusion growing again',
    summary: 'The longest-running problem in the spine and the one currently moving in the wrong direction. A disc extrusion pinching the left L5 nerve in 2015 was operated on, and the 2016 MRI showed a good result. Ten years of slow degeneration later, the protrusion is back on the left, contacting both the descending L5 and exiting L4 nerve roots, and it grew measurably between February and July 2026 — which is why the latest report recommends spine surgery follow-up.',
    metrics: [
      ['Canal diameter', '9 mm (mild stenosis)'],
      ['Protrusion', 'Left subarticular / foraminal'],
      ['Nerves contacted', 'Descending left L5, exiting left L4'],
      ['Facets', 'Severe, both sides'],
      ['Endplates', 'Modic type I, L4 to S1'],
      ['Prior surgery', '13 May 2015 — left L4 hemilaminotomy / microdiscectomy'],
      ['Trend', 'Enlarging — Feb 2026 to Jul 2026']
    ],
    findings: [
      { scan: 's2015-04-29-mri', severity: 'severe', text: 'Focal disc extrusion in the left lateral recess, effacing the recess and the left L5 nerve. Moderately severe left neural foraminal narrowing; right foramen patent. Facet degenerative changes. Loss of T2 disc signal. No central canal stenosis.', quote: 'Focal disc extrusion is noted in the left lateral recess causing effacement of the lateral recess and effacing the left L5 nerve.' },
      { scan: 's2016-05-12-mri', severity: 'moderate', event: 'post-op', text: 'After left laminotomy and microdiscectomy: improved appearance, the left central extrusion displacing the L5 root has resolved, thecal sac decompressed, no significant enhancing peridural scar. Residual left-sided bulging and a chronic left disc osteophyte, with mild narrowing of the left L4 foramen.' },
      { scan: 's2017-08-15-xr', severity: 'moderate', text: 'Disc space narrowing at L4-5 is evident. No pathologic motion with flexion and extension. Levoscoliosis.' },
      { scan: 's2025-08-11-xr', severity: 'moderate', text: 'Multilevel endplate osteophytosis with the greatest disc space narrowing at L4-5. Vertebral body heights and alignment maintained; no definite instability on flexion or extension.' },
      { scan: 's2026-02-07-mri', severity: 'severe', text: 'Moderate disc space narrowing with desiccation and Modic type I endplate changes from L4 to S1. Mild canal stenosis at 9 mm from a left subarticular / foraminal disc protrusion contacting the descending left L5 and exiting left L4 nerve roots, with ligamentum flavum thickening, dorsal epidural fat and severe bilateral facet arthropathy. Slightly larger than on the 2016 MRI.' },
      { scan: 's2026-02-17-xrl', severity: 'severe', text: 'Degenerative disc disease most severe at L4-5. No instability with flexion or extension.' },
      { scan: 's2026-07-14-mri', severity: 'severe', text: 'Interval increased size of the left L4-5 subarticular / foraminal disc protrusion relative to the prior MRI. Spine surgery follow-up is recommended.', quote: 'Interval increased size of left L4-5 subarticular/foraminal disc protrusion.' }
    ]
  },
  {
    id: 'l5-s1', label: 'L5-S1', sub: 'Lumbosacral junction · operated 2026', region: 'lumbar',
    severity: 'severe', surgical: true, canal: 'normal',
    status: 'Severe · operated 2026, residual protrusion',
    summary: 'Completely clean in 2015 and 2016, then the fastest-moving level in the whole record. By February 2026 it had severe facet arthropathy and a left foraminal disc protrusion on the exiting left L5 nerve, with severe left foraminal narrowing. A left L5 hemilaminotomy and discectomy followed, but the July 2026 MRI reports that a small left foraminal protrusion still contacts that same nerve root.',
    metrics: [
      ['Facets', 'Severe arthropathy'],
      ['Foramina', 'Severe left, moderate right'],
      ['Nerve contacted', 'Exiting left L5'],
      ['Surgery', '21 May 2026 — left L5 hemilaminotomy / discectomy'],
      ['Post-op', 'Patchy enhancement — granulation tissue or epidural fibrosis'],
      ['Residual', 'Small left foraminal protrusion still contacting the nerve']
    ],
    findings: [
      { scan: 's2015-04-29-mri', severity: 'normal', text: 'No disc herniation, central spinal stenosis, or foraminal compromise.' },
      { scan: 's2016-05-12-mri', severity: 'normal', text: 'No disc herniation, central spinal stenosis, or foraminal compromise.' },
      { scan: 's2026-02-07-mri', severity: 'severe', text: 'Severe facet arthropathy with a left foraminal disc protrusion contacting the exiting left L5 nerve root. Severe left with moderate right neural foraminal narrowing. Modic type I endplate changes.' },
      { scan: 's2026-07-14-mri', severity: 'severe', event: 'post-op', text: 'Status post left L5 hemilaminotomy and discectomy, an interval change from the previous MRI. Patchy enhancement at the surgical site, likely granulation tissue or epidural fibrosis. A small left foraminal disc protrusion remains, contacting the exiting left L5 nerve root. Severe facet arthropathy persists.' }
    ]
  },
  {
    id: 'alignment', label: 'Alignment & curvature', sub: 'Whole spine', region: 'global',
    severity: 'moderate', surgical: false, canal: 'normal', virtual: true,
    status: 'Sigmoid curve · stable',
    summary: 'The spine holds a three-part S-curve. Mild scoliosis was first mentioned in passing on the 2016 lumbar MRI, then measured properly on the 2025 standing scoliosis survey: 20 degrees leftward through the lumbar spine, 10 degrees rightward through the thoracic, 9 degrees leftward at the cervicothoracic junction, on a slightly tilted pelvis. In the neck, the normal forward curve has flattened out. Every flexion / extension study has found no instability anywhere.',
    metrics: [
      ['Lumbar curve', '20° leftward (levoscoliosis), apex L2'],
      ['Thoracic curve', '10° rightward'],
      ['Cervicothoracic curve', '9° leftward'],
      ['Pelvis', 'Minimal right-sided superior tilt'],
      ['Cervical lordosis', 'Straightened'],
      ['Instability', 'None on any flexion / extension study']
    ],
    findings: [
      { scan: 's2016-05-12-mri', severity: 'mild', text: 'Alignment stable. Mild scoliosis noted — the first mention in the record.' },
      { scan: 's2017-08-15-xr', severity: 'mild', text: 'Five lumbar vertebral bodies with levoscoliosis. No new compression deformity, no spondylolysis, no pathologic motion on flexion and extension.' },
      { scan: 's2025-08-11-xr', severity: 'moderate', text: 'Standing survey: leftward lumbar curvature with a Cobb angle of approximately 20 degrees and a slight rotary component; mild broad rightward thoracic curvature at 10 degrees; leftward cervicothoracic curvature at 9 degrees. Minimal right-sided superior pelvic tilt. Twelve rib-bearing thoracic and five lumbar segments.', quote: 'Sigmoid curvature of the thoracolumbar spine with minimal right-sided superior pelvic tilt.' },
      { scan: 's2026-02-07-mri', severity: 'moderate', text: 'Mild scoliosis without spondylolisthesis. No acute fracture or dislocation.' },
      { scan: 's2026-02-17-xrc', severity: 'moderate', text: 'Straightening of the normal cervical lordosis. No instability on flexion or extension.' },
      { scan: 's2026-02-17-xrl', severity: 'moderate', text: 'Levoscoliosis centred at L2 appears unchanged. No instability with flexion or extension.' }
    ]
  }
];

const COVERAGE_LEVEL = {
  id: 'coverage', label: 'Imaging coverage', sub: 'What has and has not been looked at', region: 'global',
  severity: 'normal', surgical: false, canal: 'normal', virtual: true, coverage: true,
  status: 'Thoracic spine largely unimaged',
  summary: 'Worth knowing before reading anything else on this page. The cervical and lumbar spine have both been imaged repeatedly and in detail. The thoracic spine, T1 through T12, has never had a study of its own — it appears only on the 2025 standing scoliosis survey, which counts the vertebrae and measures the curve but says nothing about individual discs, and on the top edge of the 2015 lumbar MRI, which caught a T10-T11 bulge in passing and was never followed up. Levels drawn with a dotted outline on the diagram are not known to be healthy; they are unexamined.',
  /* Counts are derived from SCANS at render time (see coverageMetrics in app.js) so
     they cannot drift out of step with the data. */
  metrics: null,
  findings: [
    { scan: 's2015-04-29-mri', severity: 'mild', text: 'The only look at the thoracic spine at disc level, and only its bottom edge: a T10-T11 bulge described as "partially visualized".' },
    { scan: 's2025-08-11-xr', severity: 'normal', text: 'Scoliosis survey counts 12 rib-bearing thoracic and 5 lumbar vertebral bodies and measures the curves, but reports no disc-level thoracic findings.' }
  ]
};
LEVELS.push(COVERAGE_LEVEL);

const REGIONS = [
  { id: 'cervical', label: 'Cervical', note: 'C1-C7 · well imaged' },
  { id: 'thoracic', label: 'Thoracic', note: 'T1-T12 · not individually imaged' },
  { id: 'lumbar',   label: 'Lumbar',   note: 'L1-L5 · well imaged' },
  { id: 'sacral',   label: 'Sacrum',   note: 'S1-coccyx · no findings' }
];

/* Spine geometry. Anterior is to the left in the lateral view.
   sag = sagittal offset from the mid-line (positive = posterior)
   cor = coronal offset in the front view (positive = viewer right = patient's left) */
const VERTEBRAE = [
  /* Cervical bodies are drawn taller than scale. All seven cervical levels are
     interactive and adjacent, so their row pitch (half a body + disc + half a body)
     sets the tap-target spacing for the whole diagram. 28 units keeps every target
     at 24 CSS px or more once the SVG is scaled into a 320px-wide viewport. */
  { id: 'C1', region: 'cervical', h: 20, w: 30, sag:   2, cor:  1 },
  { id: 'C2', region: 'cervical', h: 22, w: 32, sag:   0, cor:  3 },
  { id: 'C3', region: 'cervical', h: 19, w: 32, sag:  -4, cor:  4 },
  { id: 'C4', region: 'cervical', h: 19, w: 33, sag:  -7, cor:  5 },
  { id: 'C5', region: 'cervical', h: 19, w: 34, sag:  -9, cor:  7 },
  { id: 'C6', region: 'cervical', h: 19, w: 35, sag:  -8, cor:  8 },
  { id: 'C7', region: 'cervical', h: 19, w: 36, sag:  -3, cor:  8 },
  { id: 'T1', region: 'thoracic', h: 19, w: 38, sag:   1, cor:  7 },
  { id: 'T2', region: 'thoracic', h: 15, w: 39, sag:   5, cor:  4 },
  { id: 'T3', region: 'thoracic', h: 16, w: 40, sag:   9, cor:  0 },
  { id: 'T4', region: 'thoracic', h: 16, w: 41, sag:  12, cor: -4 },
  { id: 'T5', region: 'thoracic', h: 17, w: 42, sag:  15, cor: -8 },
  { id: 'T6', region: 'thoracic', h: 17, w: 43, sag:  17, cor: -11 },
  { id: 'T7', region: 'thoracic', h: 18, w: 44, sag:  17, cor: -12 },
  { id: 'T8', region: 'thoracic', h: 18, w: 45, sag:  15, cor: -12 },
  { id: 'T9', region: 'thoracic', h: 19, w: 46, sag:  12, cor: -9 },
  { id: 'T10', region: 'thoracic', h: 20, w: 47, sag:   8, cor: -5 },
  { id: 'T11', region: 'thoracic', h: 21, w: 48, sag:   4, cor:  0 },
  { id: 'T12', region: 'thoracic', h: 22, w: 50, sag:  -1, cor:  8 },
  { id: 'L1', region: 'lumbar', h: 24, w: 54, sag:  -7, cor: 17 },
  { id: 'L2', region: 'lumbar', h: 25, w: 56, sag: -12, cor: 24 },
  { id: 'L3', region: 'lumbar', h: 25, w: 58, sag: -15, cor: 23 },
  { id: 'L4', region: 'lumbar', h: 26, w: 58, sag: -14, cor: 16 },
  { id: 'L5', region: 'lumbar', h: 26, w: 57, sag:  -9, cor:  7 }
];

/* Disc between the vertebra of the same index and the next one. `level` links to LEVELS. */
const DISCS = [
  { id: 'C1-C2', after: 'C1', h:  7, level: 'c1-c2', joint: true },
  { id: 'C2-C3', after: 'C2', h:  9, level: 'c2-c3' },
  { id: 'C3-C4', after: 'C3', h:  9, level: 'c3-c4' },
  { id: 'C4-C5', after: 'C4', h:  9, level: 'c4-c5' },
  { id: 'C5-C6', after: 'C5', h:  9, level: 'c5-c6' },
  { id: 'C6-C7', after: 'C6', h:  9, level: 'c6-c7' },
  { id: 'C7-T1', after: 'C7', h:  9, level: 'c7-t1' },
  { id: 'T1-T2', after: 'T1', h:  5 },
  { id: 'T2-T3', after: 'T2', h:  5 },
  { id: 'T3-T4', after: 'T3', h:  5 },
  { id: 'T4-T5', after: 'T4', h:  5 },
  { id: 'T5-T6', after: 'T5', h:  5 },
  { id: 'T6-T7', after: 'T6', h:  5 },
  { id: 'T7-T8', after: 'T7', h:  5 },
  { id: 'T8-T9', after: 'T8', h:  6 },
  { id: 'T9-T10', after: 'T9', h:  6 },
  { id: 'T10-T11', after: 'T10', h:  7, level: 't10-t11' },
  { id: 'T11-T12', after: 'T11', h:  7 },
  { id: 'T12-L1', after: 'T12', h:  9 },
  { id: 'L1-L2', after: 'L1', h: 11, level: 'l1-l2' },
  { id: 'L2-L3', after: 'L2', h: 12, level: 'l2-l3' },
  { id: 'L3-L4', after: 'L3', h: 12, level: 'l3-l4' },
  { id: 'L4-L5', after: 'L4', h:  9, level: 'l4-l5' },
  { id: 'L5-S1', after: 'L5', h: 11, level: 'l5-s1' }
];

const SEVERITY = {
  normal:   { rank: 0, label: 'No findings', short: 'None' },
  mild:     { rank: 1, label: 'Mild', short: 'Mild' },
  moderate: { rank: 2, label: 'Moderate', short: 'Mod' },
  severe:   { rank: 3, label: 'Severe', short: 'Severe' }
};

const REGION_LABEL = {
  cranial: 'Skull base', cervical: 'Cervical', thoracic: 'Thoracic',
  lumbar: 'Lumbar', global: 'Whole spine'
};
