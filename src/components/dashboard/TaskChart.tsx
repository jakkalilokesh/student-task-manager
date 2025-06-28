import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', completed: 4, pending: 2 },
  { name: 'Tue', completed: 6, pending: 3 },
  { name: 'Wed', completed: 8, pending: 1 },
  { name: 'Thu', completed: 5, pending: 4 },
  { name: 'Fri', completed: 7, pending: 2 },
  { name: 'Sat', completed: 3, pending: 1 },
  { name: 'Sun', completed: 2, pending: 0 },
];

export const TaskChart: React.FC = () => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="name" className="text-sm" />
          <YAxis className="text-sm" />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};