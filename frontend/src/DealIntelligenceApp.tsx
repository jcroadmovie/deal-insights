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

  async function handleUpload() {
    if (!files) return;
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    setDeals(data.deals);
  }

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <Input type="file" multiple onChange={e => setFiles(e.target.files)} />
        <Button onClick={handleUpload}>Upload Teasers</Button>
      </div>

      {deals.length > 0 && (
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
                  {deals.map((deal, i) => (
                    <TableRow key={i} onClick={() => setSelectedDeal(deal)} className="cursor-pointer">
                      <TableCell>{deal.name}</TableCell>
                      <TableCell>{deal.sector}</TableCell>
                      <TableCell>{deal.revenue}</TableCell>
                      <TableCell>{deal.ebitda}</TableCell>
                      <TableCell>{deal.margin}</TableCell>
                      <TableCell>{deal.capital_sought}</TableCell>
                      <TableCell>{deal.objective}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="memo">
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
                  <p><strong>AI Insights:</strong> {selectedDeal.ai_insights}</p>
                  <Button variant="outline" onClick={() => alert('Deep research view coming soon...')}>Explore More</Button>
                </CardContent>
              </Card>
            ) : (
              <p>Select a deal from the comparison tab to view its memo.</p>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
