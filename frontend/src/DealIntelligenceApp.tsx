import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DealIntelligenceApp() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [deals, setDeals] = useState<any[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null);
  const [memo, setMemo] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  async function handleUpload() {
    if (!files) return;
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));
    try {
      setStatus('Uploading...');
      const res = await fetch(`${apiUrl}/upload`, { method: 'POST', body: formData });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Upload failed');
      }
      const data = await res.json();
      setDeals(data.deals);
      setStatus('Upload successful');
    } catch (err) {
      console.error(err);
      setStatus('Upload failed');
    }
  }

  async function handleSelectDeal(deal: any) {
    setSelectedDeal(deal);
    setMemo('Generating memo...');
    try {
      const res = await fetch(`${apiUrl}/deals/${deal.id}/memo`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Request failed');
      }
      const data = await res.json();
      setMemo(data.memo);
    } catch (err) {
      console.error(err);
      setMemo('Failed to generate memo');
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <Input type="file" accept="application/pdf" multiple onChange={e => setFiles(e.target.files)} />
        <Button onClick={handleUpload}>Upload Teasers</Button>
        {status && <p>{status}</p>}
      </div>

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList>
          <TabsTrigger value="comparison">Compare Deals</TabsTrigger>
          <TabsTrigger value="memo">Smart Memos</TabsTrigger>
        </TabsList>

          <TabsContent value="comparison">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>EBITDA</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead>Capital Sought</TableHead>
                  <TableHead>Ownership Objective</TableHead>
                </TableRow>
              </TableHeader>
                <TableBody>
                  {deals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Upload teasers to compare deals.
                      </TableCell>
                    </TableRow>
                  ) : (
                    deals.map((deal, i) => (
                      <TableRow key={i} onClick={() => handleSelectDeal(deal)} className="cursor-pointer">
                        <TableCell>{deal.name}</TableCell>
                        <TableCell>{deal.sector}</TableCell>
                        <TableCell>{deal.revenue}</TableCell>
                        <TableCell>{deal.ebitda}</TableCell>
                        <TableCell>{deal.margin}</TableCell>
                        <TableCell>{deal.capital_sought}</TableCell>
                        <TableCell>{deal.objective}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="memo">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="md:w-1/2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>EBITDA</TableHead>
                      <TableHead>Margin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          Upload teasers to generate memos.
                        </TableCell>
                      </TableRow>
                    ) : (
                      deals.map((deal, i) => (
                        <TableRow
                          key={i}
                          onClick={() => handleSelectDeal(deal)}
                          className={`cursor-pointer ${selectedDeal === deal ? 'bg-gray-100' : ''}`}
                        >
                          <TableCell>{deal.name}</TableCell>
                          <TableCell>{deal.sector}</TableCell>
                          <TableCell>{deal.revenue}</TableCell>
                          <TableCell>{deal.ebitda}</TableCell>
                          <TableCell>{deal.margin}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="md:w-1/2">
                {selectedDeal ? (
                  <Card>
                    <CardContent className="space-y-2">
                      <h2 className="text-xl font-semibold">Smart Memo: {selectedDeal.name}</h2>
                      <p><strong>Sector:</strong> {selectedDeal.sector}</p>
                      <p><strong>Overview:</strong> {selectedDeal.summary}</p>
                      <p><strong>Investment Highlights:</strong></p>
                      <ul className="list-disc pl-4">
                        {selectedDeal.highlights.map((h: string, i: number) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                      <p><strong>AI Insights:</strong></p>
                      {memo.split('\n').map((line, i) => (
                        line.trim() && <p key={i}>{line}</p>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => alert('Deep research view coming soon...')}
                      >
                        Explore More
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <p>Select a deal to view its memo.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
}
