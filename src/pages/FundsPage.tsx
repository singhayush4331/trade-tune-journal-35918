import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import FundsManagement from '@/components/funds/FundsManagement';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, IndianRupee, Info, Wallet, Landmark, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile, useIsSmall } from '@/hooks/use-mobile';

const FundsPage = () => {
  const isMobile = useIsMobile();
  const isSmall = useIsSmall();

  return (
    <AppLayout>
      <div className="min-h-full">
        <div className="w-full relative overflow-hidden pb-12">
          <div className="bg-gradient-to-br from-primary/20 via-background to-purple-500/10 pt-4 md:pt-6 pb-8 md:pb-12 relative">
            <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-20 left-10 w-64 h-64 bg-gradient-to-r from-success/20 to-primary/20 rounded-full blur-3xl opacity-50"></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="container max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-6 md:pb-8 relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                <div className="md:col-span-7">
                  <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 leading-[1.3] py-1"
                  >
                    <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent pb-2">
                      Funds Management
                    </span>
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 max-w-2xl"
                  >
                    Track your capital, monitor your deposits and withdrawals, and analyze your trading performance all in one place.
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className={`flex flex-wrap items-center ${isMobile ? 'gap-x-2 gap-y-2' : 'gap-x-8 gap-y-4'} mt-2`}
                  >
                    {!isSmall ? (
                      <>
                        <Card className="border-0 bg-primary/5 backdrop-blur-sm shadow-sm">
                          <CardContent className="flex items-center gap-3 py-3 px-4">
                            <div className="bg-success/10 p-2 rounded-full">
                              <ArrowUpRight className="h-5 w-5 text-success" />
                            </div>
                            <div className="text-sm">
                              <span className="block text-muted-foreground">Deposits</span>
                              <span className="font-semibold">Capital In</span>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-0 bg-primary/5 backdrop-blur-sm shadow-sm">
                          <CardContent className="flex items-center gap-3 py-3 px-4">
                            <div className="bg-destructive/10 p-2 rounded-full">
                              <ArrowDownRight className="h-5 w-5 text-destructive" />
                            </div>
                            <div className="text-sm">
                              <span className="block text-muted-foreground">Withdrawals</span>
                              <span className="font-semibold">Capital Out</span>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Card className="border-0 bg-primary/5 backdrop-blur-sm shadow-sm cursor-help">
                                <CardContent className="flex items-center gap-3 py-3 px-4">
                                  <div className="bg-purple-500/10 p-2 rounded-full">
                                    <Wallet className="h-5 w-5 text-purple-500" />
                                  </div>
                                  <div className="text-sm">
                                    <span className="block text-muted-foreground">Initial Capital</span>
                                    <span className="font-semibold">Starting Point</span>
                                  </div>
                                </CardContent>
                              </Card>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              Use the "Edit Fund" button to set your initial trading capital. This replaces all previous deposit/withdrawal transactions.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 w-full">
                        <Card className="border-0 bg-primary/5 backdrop-blur-sm shadow-sm">
                          <CardContent className="flex flex-col items-center gap-1 p-2">
                            <div className="bg-success/10 p-1 rounded-full">
                              <ArrowUpRight className="h-4 w-4 text-success" />
                            </div>
                            <div className="text-xs text-center">
                              <span className="font-medium">Deposits</span>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-0 bg-primary/5 backdrop-blur-sm shadow-sm">
                          <CardContent className="flex flex-col items-center gap-1 p-2">
                            <div className="bg-destructive/10 p-1 rounded-full">
                              <ArrowDownRight className="h-4 w-4 text-destructive" />
                            </div>
                            <div className="text-xs text-center">
                              <span className="font-medium">Withdrawals</span>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Card className="border-0 bg-primary/5 backdrop-blur-sm shadow-sm cursor-help">
                                <CardContent className="flex flex-col items-center gap-1 p-2">
                                  <div className="bg-purple-500/10 p-1 rounded-full">
                                    <Wallet className="h-4 w-4 text-purple-500" />
                                  </div>
                                  <div className="text-xs text-center">
                                    <span className="font-medium">Capital</span>
                                  </div>
                                </CardContent>
                              </Card>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              Use the "Edit Fund" button to set your initial trading capital.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </motion.div>
                </div>
                
                <div className="md:col-span-5 hidden md:block">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.7, delay: 0.3, type: "spring" }}
                    className="relative h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-primary/10 p-0.5"
                  >
                    <div className="absolute inset-0 rounded-2xl backdrop-blur-sm bg-background/30 overflow-hidden">
                      <div className="absolute -bottom-2 -right-2 w-40 h-40 bg-primary/20 rounded-full blur-2xl"></div>
                      <div className="absolute -top-2 -left-2 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
                      
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <div className="space-y-6 text-center">
                          <Landmark className="h-12 w-12 mx-auto text-primary opacity-70" />
                          <div>
                            <h3 className="text-lg font-medium text-foreground mb-1">Capital Management</h3>
                            <p className="text-sm text-muted-foreground">
                              Track your funding sources and manage your investment capital efficiently
                            </p>
                          </div>
                          <div className="flex justify-center gap-2">
                            <TrendingUp className="h-5 w-5 text-success" />
                            <IndianRupee className="h-5 w-5 text-primary" />
                            <Wallet className="h-5 w-5 text-purple-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="container max-w-7xl mx-auto px-3 sm:px-6 -mt-8 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <FundsManagement />
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default FundsPage;
