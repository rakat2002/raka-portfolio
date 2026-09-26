import { profile } from '../data/profile'
import { isPlaceholder } from './placeholders'
import type { OutputLine } from './terminal'

export interface RunConfig {
  projectName: string
  command: string
  lines: OutputLine[]
}

const line = (text: string, delay = 0, tone?: OutputLine['tone']): OutputLine => ({ text, tone, delay })

const CURATED: RunConfig[] = [
  {
    projectName: 'Loan Approval Prediction',
    command: 'python train_models.py',
    lines: [
      line('Loading dataset (45,000 rows)...', 150, 'muted'),
      line('Cleaning outliers and encoding categorical features...', 250, 'muted'),
      line('Scaling features (StandardScaler)...', 200, 'muted'),
      line('Training KNN, Decision Tree, Logistic Regression, Naive Bayes, Neural Network...', 400, 'muted'),
      line('', 0),
      line('Model            Accuracy   AUC', 150, 'info'),
      line('Neural Network   91.79%     0.967', 120),
      line('Decision Tree    91.68%     0.963', 120),
      line('KNN              90.03%     0.939', 120),
      line('', 0),
      line('✓ Best model: Neural Network (91.79% accuracy, 0.967 AUC)', 200, 'success'),
    ],
  },
  {
    projectName: 'Machine Translation of Bangla Regional Dialects',
    command: 'python evaluate_models.py',
    lines: [
      line('Loading ONUBAD-derived parallel corpus (1,866 pairs)...', 150, 'muted'),
      line('Splitting train/validation/test (80/10/10, stratified)...', 200, 'muted'),
      line('Evaluating 6 models: lexical baselines, Seq2Seq LSTM (+attention), BanglaT5, mBART-50...', 400, 'muted'),
      line('', 0),
      line('Model                  Chittagong BLEU   Sylhet BLEU', 150, 'info'),
      line('mBART-50 (fine-tuned)  0.425             0.480', 120),
      line('Seq2Seq LSTM           0.305             0.394', 120),
      line('Dictionary Lookup      0.184             0.215', 120),
      line('', 0),
      line('✓ Best model: fine-tuned mBART-50 (BLEU 0.43-0.48, chrF 0.82-0.83)', 200, 'success'),
    ],
  },
]

function genericConfig(name: string, technologies: string[]): RunConfig {
  return {
    projectName: name,
    command: `run ${name.toLowerCase().replace(/\s+/g, '-')}`,
    lines: [
      line(`Initializing ${name}...`, 150, 'muted'),
      ...(technologies.length > 0
        ? [line(`Loading: ${technologies.join(', ')}...`, 200, 'muted')]
        : []),
      line(`Running ${name}...`, 250, 'muted'),
      line('✓ Done', 200, 'success'),
    ],
  }
}

export function getRunConfig(projectName: string, technologies: string[]): RunConfig {
  return CURATED.find((c) => c.projectName === projectName) ?? genericConfig(projectName, technologies)
}

export const runnableProjects = () => profile.projects.filter((p) => !isPlaceholder(p.name))