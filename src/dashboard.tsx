import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7
    }
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
const BG_GRADIENT = 'bg-gradient-to-br from-slate-50 to-slate-100';

interface User {
  id: number;
  name: string;
  email: string;
  address: {
    city: string;
    street: string;
  };
  company: {
    name: string;
  };
  phone: string;
}

function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        setUsers(data);
        
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalUsers = users.length;
  const totalCities = new Set(users.map(user => user.address.city)).size;
  const totalStreets = new Set(users.map(user => user.address.street)).size;
  const totalEmails = new Set(users.map(user => user.email)).size;

  const cityData = users.reduce((acc: { name: string; users: number }[], user) => {
    const city = user.address.city;
    const existing = acc.find(item => item.name === city);
    if (existing) {
      existing.users += 1;
    } else {
      acc.push({ name: city, users: 1 });
    }
    return acc;
  }, []);

  const companyData = users.reduce((acc: { name: string; count: number }[], user) => {
    const company = user.company.name;
    const existing = acc.find(item => item.name === company);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: company, count: 1 });
    }
    return acc;
  }, []);

  const generateGrowthData = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      name: `Month ${i + 1}`,
      users: Math.floor(Math.random() * 10) + i * 2,
    }));
  };

  const growthData = generateGrowthData();

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      description: "All registered users",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Cities",
      value: totalCities,
      description: "Cities where users reside",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Streets",
      value: totalStreets,
      description: "Unique street addresses",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Total Emails",
      value: totalEmails,
      description: "Unique email addresses",
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ];

  return (
    <div className={`min-h-screen ${BG_GRADIENT} p-4 md:p-6`}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold mb-6 text-slate-800 flex justify-between items-center"
        >
          <span>
          User Analytics Dashboard
          </span>
          <Link to='/git-profile'>Github Users</Link>
        </motion.h1>
        
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">
                    {stat.title}
                  </CardTitle>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${stat.bgColor}`}>
                    <span className="text-xs">📊</span>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <>
                      <Skeleton className="h-7 w-16 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </>
                  ) : (
                    <>
                      <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                      <p className="text-xs text-slate-500">{stat.description}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <motion.div variants={chartVariants}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-800">Users by City</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cityData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="users" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={chartVariants}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-800">Users by Company</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={companyData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                        >
                          {companyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-800">User Growth Simulation</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-slate-50">
              <CardTitle className="text-slate-800">User Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-100">
                      <TableRow>
                        <TableHead className="font-semibold text-slate-800">Name</TableHead>
                        <TableHead className="font-semibold text-slate-800">Email</TableHead>
                        <TableHead className="font-semibold text-slate-800">City</TableHead>
                        <TableHead className="font-semibold text-slate-800">Company</TableHead>
                        <TableHead className="font-semibold text-slate-800">Phone</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map(user => (
                        <TableRow key={user.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.address.city}</TableCell>
                          <TableCell>{user.company.name}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Dashboard;