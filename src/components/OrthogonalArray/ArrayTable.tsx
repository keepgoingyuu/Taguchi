import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useExperiment } from '../../contexts/ExperimentContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../ui/Table';
import { getArraySubset, convertToActualLevels } from '../../utils/taguchi/orthogonalArrays';

export function ArrayTable() {
  const { state } = useExperiment();
  const { orthogonalArray, factors } = state;
  const [copied, setCopied] = useState(false);

  if (!orthogonalArray || factors.length === 0) {
    return null;
  }

  const subset = getArraySubset(orthogonalArray, factors.length);
  const actualLevels = convertToActualLevels(subset, factors);

  const handleCopy = async () => {
    const header = ['實驗', ...factors.map((f) => f.name)].join('\t');
    const rows = actualLevels.map((row, i) => [i + 1, ...row].join('\t'));
    const text = [header, ...rows].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const header = ['實驗', ...factors.map((f) => f.name)].join(',');
    const rows = actualLevels.map((row, i) => [i + 1, ...row].join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${orthogonalArray.name}_experiment_plan.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card
      title="實驗計畫表"
      description="根據直交表產生的實驗組合，每一列代表一次實驗的因子設定"
    >
      <div className="space-y-4">
        {/* 操作按鈕 */}
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1 text-green-500" />
                已複製
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                複製表格
              </>
            )}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" />
            下載 CSV
          </Button>
        </div>

        {/* 表格 */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header className="w-16 text-center">實驗</TableCell>
                {factors.map((factor) => (
                  <TableCell header key={factor.id} className="text-center">
                    <div>{factor.id}</div>
                    <div className="text-xs font-normal text-gray-500 dark:text-gray-400">
                      {factor.name}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {actualLevels.map((row, runIndex) => (
                <TableRow key={runIndex}>
                  <TableCell className="text-center font-medium">
                    {runIndex + 1}
                  </TableCell>
                  {row.map((level, factorIndex) => (
                    <TableCell key={factorIndex} className="text-center">
                      {level}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
