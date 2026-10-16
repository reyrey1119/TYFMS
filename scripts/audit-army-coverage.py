#!/usr/bin/env python3
"""Build a review queue from classification headings and chart rows, not code mentions.

This is an inventory aid, not an importer or a declaration of current coverage.
Run: python scripts/audit-army-coverage.py --corpus PATH --output PATH
"""
import argparse
import collections
import hashlib
import json
import re
from pathlib import Path


def audit(corpus):
    catalog = json.loads((corpus / 'inventory.json').read_text())
    by_path = {s['relative_path']: s for s in catalog}
    records = {}
    sources = {}

    def scan(filename, category, patterns, kind):
        rel = 'Classification-611-21/' + filename + '.pdf'
        raw = (corpus / rel.replace('.pdf', '.txt')).read_text()
        metadata = by_path[rel]
        digest = hashlib.sha256((corpus / rel).read_bytes()).hexdigest()
        if digest != metadata['sha256']:
            raise ValueError('Source checksum mismatch: ' + rel)
        sources[rel] = {'url': metadata['url'], 'sha256': digest}
        for page, text in enumerate(raw.split('\f'), 1):
            for line in text.splitlines():
                for pattern in patterns:
                    match = re.match(pattern, line)
                    if not match:
                        continue
                    code = match.group('code')
                    key = (category, code)
                    row = records.setdefault(key, {
                        'category': category, 'code': code,
                        'classification_evidence': [], 'guide_candidates': [],
                        'review_status': 'pending',
                    })
                    row['classification_evidence'].append({
                        'source': rel, 'pdf_page': page, 'kind': kind,
                        'line': line.strip(),
                    })
                    break

    scan('chapter-10c-enlisted-mos-specifications', 'enlisted', [
        r'^\s*10[-–](?P<code>\d{2}[A-Z])\.',
    ], 'specification_heading')
    scan('chapter-3-officer-branches-and-fas', 'officer', [
        r'^\s*(?P<code>\d{2}[A-Z])\s+\d\s*[-–]\s*\d\s+\S',
    ], 'grade_chart_row')
    scan('chapter-8a-wo-branches-and-aocs', 'warrant', [
        r'^\s*(?P<code>\d{3}[A-Z])\s+\d\s*[-–]\s*\d\s+\S',
    ], 'grade_chart_row')
    scan('chapter-8b-wo-specifications', 'warrant', [
        r'^\s*8[-–](?P<code>\d{3}[A-Z])\.',
        r'^\s*8[-–]\d{3}\.\s+(?:MOS|Military Occupational Specialty)\s+(?P<code>\d{3}[A-Z])\b',
    ], 'specification_heading')

    # A mention supplies only a place to inspect. It never grants applicability,
    # current-code status, rank coverage, or approval.
    for source in catalog:
        if source['group'] not in ('Enlisted-600-25', 'Officer-600-3'):
            continue
        rel = source['relative_path']
        text = (corpus / rel.replace('.pdf', '.txt')).read_text()
        mentions = collections.defaultdict(list)
        for page_number, page in enumerate(text.split('\f'), 1):
            for code in set(re.findall(r'(?<![A-Z0-9])(?:\d{3}[A-Z]|\d{2}[A-Z])(?![A-Z0-9])', page)):
                mentions[code].append(page_number)
        for row in records.values():
            if row['category'] == 'officer' and source['group'] != 'Officer-600-3':
                continue
            if row['category'] == 'enlisted' and source['group'] != 'Enlisted-600-25':
                continue
            pages = mentions.get(row['code'], [])
            if pages:
                row['guide_candidates'].append({'path': rel, 'mention_pages': pages})

    result = sorted(records.values(), key=lambda r: (r['category'], r['code']))
    for row in result:
        row['needs_specification_heading_review'] = not any(
            e['kind'] == 'specification_heading' for e in row['classification_evidence'])
        row['special_reporting_code_candidate'] = row['category'] == 'enlisted' and row['code'].startswith('00')
    return {
        'scope': 'Army only; other branches deferred',
        'status': 'INCOMPLETE REVIEW QUEUE, NOT VERIFIED COVERAGE',
        'limitations': [
            'Downloaded classification editions and amendments still need currency review.',
            'Historical, future-effective, special reporting and immaterial codes need separate treatment.',
            'Chart grades describe position standards, not proof of personal duties.',
            'Guide mentions may be feeder codes or cross-references, not guidance for that code.',
            'Missing or differently formatted headings may escape extraction; reconcile charts and specifications.',
            'No database state is read and no source is approved by this script.',
        ],
        'counts_by_category': dict(collections.Counter(r['category'] for r in result)),
        'classification_sources': sources,
        'occupations': result,
    }


def markdown(report):
    lines = ['# Army specialty coverage review queue', '', report['status'], '',
             'These are classification candidates, not a certified list of current specialties.', '',
             '| Category | Candidate codes |', '|---|---:|']
    lines += [f'| {k} | {v} |' for k, v in report['counts_by_category'].items()]
    lines += ['', '## Limits', ''] + ['- ' + x for x in report['limitations']]
    lines += ['', '## Review queue', '',
              '| Category | Code | Classification PDF pages | Guide candidates | Status |',
              '|---|---|---|---:|---|']
    for row in report['occupations']:
        pages = '; '.join(sorted({e['source'].split('/')[-1] + ': ' + str(e['pdf_page'])
                                  for e in row['classification_evidence']}))
        lines.append(f"| {row['category']} | {row['code']} | {pages} | {len(row['guide_candidates'])} | pending |")
    return '\n'.join(lines) + '\n'


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--corpus', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    report = audit(args.corpus)
    # Known real headings ensure an obvious layout failure cannot silently emit
    # a reassuring empty queue. This does not establish completeness.
    found = {(r['category'], r['code']) for r in report['occupations']}
    assert {('enlisted', '42A'), ('enlisted', '36B'), ('officer', '36A'),
            ('officer', '42B'), ('warrant', '420A'), ('warrant', '150U')} <= found
    args.output.mkdir(parents=True, exist_ok=True)
    (args.output / 'army-coverage-queue.json').write_text(json.dumps(report, indent=2) + '\n')
    (args.output / 'army-coverage-queue.md').write_text(markdown(report))
    print(json.dumps(report['counts_by_category']))
