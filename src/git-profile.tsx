import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Users, MapPin, Link, Building, Twitter, Star, GitFork } from 'lucide-react';

// Animation variants
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

const BG_GRADIENT = 'bg-gradient-to-br from-slate-50 to-slate-100';

function GithubProfileViewer() {
  interface UserData {
    avatar_url: string;
    name: string;
    login: string;
    html_url: string;
    bio?: string;
    followers: number;
    following: number;
    company?: string;
    location?: string;
    blog?: string;
    twitter_username?: string;
  }
  
  interface Repo {
    id: number;
    name: string;
    html_url: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
  }

    const [username, setUsername] = useState('');
    const [userData, setUserData] = useState<UserData | null>(null);
    const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchUser = async () => {
    if (!username.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!userResponse.ok) {
        throw new Error('User not found');
      }
      const userData = await userResponse.json();
      setUserData(userData);
      
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
      const reposData = await reposResponse.json();
      setRepos(reposData);
    } catch (err: any) {
      setError((err as Error).message);
      setUserData(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

interface KeyPressEvent {
    key: string;
}

const handleKeyPress = (e: KeyPressEvent) => {
    if (e.key === 'Enter') {
        searchUser();
    }
};

  return (
    <div className={`min-h-screen ${BG_GRADIENT} p-4 md:p-6`}>
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-6 text-slate-800 text-center"
        >
          GitHub Profile Viewer
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type="text"
                    placeholder="Enter GitHub username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 py-2 h-12 text-lg"
                  />
                </div>
                <Button 
                  onClick={searchUser} 
                  disabled={loading}
                  className="h-12 px-6 text-lg bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700"
            >
              Error: {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              variants={containerVariants}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Profile Skeleton */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <Skeleton className="h-40 w-40 rounded-full mb-4" />
                      <Skeleton className="h-8 w-48 mb-2" />
                      <Skeleton className="h-5 w-32 mb-6" />
                      <Skeleton className="h-5 w-full mb-2" />
                      <Skeleton className="h-5 w-full mb-2" />
                      <Skeleton className="h-5 w-3/4 mb-6" />
                      <Skeleton className="h-10 w-full mb-4" />
                      <div className="w-full grid grid-cols-2 gap-4">
                        <Skeleton className="h-20 rounded-lg" />
                        <Skeleton className="h-20 rounded-lg" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>
                      <Skeleton className="h-8 w-48" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="mb-4 p-4 border rounded-lg">
                        <Skeleton className="h-6 w-64 mb-2" />
                        <Skeleton className="h-5 w-full mb-3" />
                        <div className="flex gap-4">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : userData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              variants={containerVariants}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <motion.img
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        src={userData.avatar_url}
                        alt={userData.name || userData.login}
                        className="h-40 w-40 rounded-full mb-4 border-4 border-white shadow-lg"
                      />
                      <h2 className="text-2xl font-bold text-slate-800 mb-1">
                        {userData.name || userData.login}
                      </h2>
                      <p className="text-slate-600 mb-6">@{userData.login}</p>
                      
                      {userData.bio && (
                        <p className="text-slate-700 mb-6 text-center">{userData.bio}</p>
                      )}
                      
                      <Button 
                        asChild 
                        className="w-full mb-6 bg-blue-600 hover:bg-blue-700"
                      >
                        <a href={userData.html_url} target="_blank" rel="noopener noreferrer">
                          View on GitHub
                        </a>
                      </Button>
                      
                      <div className="w-full grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-100 rounded-lg p-4 text-center">
                          <p className="text-sm text-slate-600">Followers</p>
                          <p className="text-2xl font-bold text-slate-800">{userData.followers}</p>
                        </div>
                        <div className="bg-slate-100 rounded-lg p-4 text-center">
                          <p className="text-sm text-slate-600">Following</p>
                          <p className="text-2xl font-bold text-slate-800">{userData.following}</p>
                        </div>
                      </div>
                      
                      <div className="w-full space-y-3">
                        {userData.company && (
                          <div className="flex items-center text-slate-700">
                            <Building className="h-4 w-4 mr-2" />
                            <span>{userData.company}</span>
                          </div>
                        )}
                        
                        {userData.location && (
                          <div className="flex items-center text-slate-700">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{userData.location}</span>
                          </div>
                        )}
                        
                        {userData.blog && (
                          <div className="flex items-center text-slate-700">
                            <Link className="h-4 w-4 mr-2" />
                            <a 
                              href={userData.blog} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 truncate"
                            >
                              {userData.blog}
                            </a>
                          </div>
                        )}
                        
                        {userData.twitter_username && (
                          <div className="flex items-center text-slate-700">
                            <Twitter className="h-4 w-4 mr-2" />
                            <a 
                              href={`https://twitter.com/${userData.twitter_username}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-blue-600"
                            >
                              @{userData.twitter_username}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-800">Public Repositories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {repos.length === 0 ? (
                      <p className="text-center text-slate-600 py-8">No public repositories found.</p>
                    ) : (
                      <div className="space-y-4">
                        {repos.map((repo) => (
                          <motion.div
                            key={repo.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-semibold text-slate-800">
                                <a 
                                  href={repo.html_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:text-blue-600"
                                >
                                  {repo.name}
                                </a>
                              </h3>
                              <div className="flex items-center text-sm text-slate-600">
                                <span className="flex items-center mr-3">
                                  <Star className="h-4 w-4 mr-1" />
                                  {repo.stargazers_count}
                                </span>
                                <span className="flex items-center">
                                  <GitFork className="h-4 w-4 mr-1" />
                                  {repo.forks_count}
                                </span>
                              </div>
                            </div>
                            
                            {repo.description && (
                              <p className="text-slate-700 mb-3">{repo.description}</p>
                            )}
                            
                            {repo.language && (
                              <div className="flex items-center">
                                <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                                <span className="text-sm text-slate-600">{repo.language}</span>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default GithubProfileViewer;