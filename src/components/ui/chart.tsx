'use client';

import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/utils/firebase/transaction';
import { TransactionData } from '@/utils/firebase/transaction';

interface ChartData {
    date: string;
    revenue: number;
}

export function Chart() {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const transactionsQuery = query(
                    collection(db, 'transaction'),
                    orderBy('orderDate', 'asc')
                );
                const querySnapshot = await getDocs(transactionsQuery);

                // Group transactions by date and calculate daily revenue
                const dailyRevenue = querySnapshot.docs.reduce((acc: { [key: string]: number }, doc) => {
                    const transaction = doc.data() as TransactionData;
                    const date = new Date(transaction.orderDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short'
                    });

                    if (!acc[date]) {
                        acc[date] = 0;
                    }
                    acc[date] += transaction.totalAmount;
                    return acc;
                }, {});

                // Convert to array format for the chart
                const chartData = Object.entries(dailyRevenue).map(([date, revenue]) => ({
                    date,
                    revenue
                }));

                setData(chartData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-[300px] flex items-center justify-center">
                <p>Loading transaction data...</p>
            </div>
        );
    }

    return (
        <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `Rp ${value.toLocaleString()}`}
                    />
                    <Tooltip
                        formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Revenue']}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563eb"
                        strokeWidth={2}
                        name="Revenue"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
} 