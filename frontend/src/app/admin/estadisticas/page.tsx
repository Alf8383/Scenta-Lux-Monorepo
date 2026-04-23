'use client';

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Info, DollarSign } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialIncomeData = [
  { month: 'Enero', income: 1860, expenses: 800 },
  { month: 'Febrero', income: 3050, expenses: 1200 },
  { month: 'Marzo', income: 2370, expenses: 950 },
  { month: 'Abril', income: 2780, expenses: 1100 },
  { month: 'Mayo', income: 1890, expenses: 850 },
  { month: 'Junio', income: 2390, expenses: 1000 },
];

const recentSalesData = [
  { id: 1, name: 'Olivia Martin', email: 'olivia.martin@email.com', avatar: { src: 'https://picsum.photos/seed/sales-user1/40/40', fallback: 'OM' }, sale: 1999.00 },
  { id: 2, name: 'Jackson Lee', email: 'jackson.lee@email.com', avatar: { src: 'https://picsum.photos/seed/sales-user2/40/40', fallback: 'JL' }, sale: 39.00 },
  { id: 3, name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', avatar: { src: 'https://picsum.photos/seed/sales-user3/40/40', fallback: 'IN' }, sale: 299.00 },
  { id: 4, name: 'William Kim', email: 'will@email.com', avatar: { src: 'https://picsum.photos/seed/sales-user4/40/40', fallback: 'WK' }, sale: 99.00 },
  { id: 5, name: 'Sofia Davis', email: 'sofia.davis@email.com', avatar: { src: 'https://picsum.photos/seed/sales-user5/40/40', fallback: 'SD' }, sale: 39.00 },
];

const chartConfig = {
  income: { label: "Ingresos", color: "hsl(var(--chart-2))" },
  expenses: { label: "Egresos", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

export default function StatisticsPage() {
  const [incomeData, setIncomeData] = useState(initialIncomeData);
  const [newExpense, setNewExpense] = useState('');

  const totalIncome = incomeData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = incomeData.reduce((sum, item) => sum + item.expenses, 0);
  const netProfit = totalIncome - totalExpenses;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const expenseAmount = parseFloat(newExpense);
    if (!isNaN(expenseAmount) && expenseAmount > 0) {
      // Distribute the new expense across the months for simulation
      const updatedData = incomeData.map(d => ({
        ...d,
        expenses: d.expenses + expenseAmount / incomeData.length,
      }));
      setIncomeData(updatedData);
      setNewExpense('');
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Mes,Ingresos,Egresos\n" 
      + incomeData.map(e => `${e.month},${e.income.toFixed(2)},${e.expenses.toFixed(2)}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "estadisticas_scentalux.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Estadísticas</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar a Excel
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Basado en los últimos 6 meses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Incluye gastos manuales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancia Neta</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>${netProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Ingresos menos egresos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ingresos vs. Egresos</CardTitle>
            <CardDescription>Resumen mensual de los últimos 6 meses.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart accessibilityLayer data={incomeData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <div className="col-span-4 lg:col-span-3 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Añadir Egreso</CardTitle>
                    <CardDescription>Registra un nuevo gasto para actualizar las estadísticas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddExpense} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="expense">Monto del Egreso</Label>
                            <Input id="expense" type="number" placeholder="Ej: 350.00" value={newExpense} onChange={e => setNewExpense(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full">Registrar Egreso</Button>
                    </form>
                </CardContent>
            </Card>
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Datos de Muestra</AlertTitle>
                <AlertDescription>
                Los datos de ventas son de ejemplo. Los egresos que añadas se distribuirán entre los meses para simular su impacto.
                </AlertDescription>
            </Alert>
        </div>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
            <CardDescription>Se han realizado 5 ventas este mes.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-8">
              {recentSalesData.map(sale => (
                <div className="flex items-center" key={sale.id}>
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={sale.avatar.src} alt="Avatar" />
                        <AvatarFallback>{sale.avatar.fallback}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{sale.name}</p>
                        <p className="text-sm text-muted-foreground">{sale.email}</p>
                    </div>
                    <div className="ml-auto font-medium">+${sale.sale.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tendencia de Ingresos</CardTitle>
             <CardDescription>Análisis de la tendencia de ingresos.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <LineChart accessibilityLayer data={incomeData}>
                 <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="var(--color-income)" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
