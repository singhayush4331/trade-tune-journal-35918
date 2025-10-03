import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			screens: {
				'xxs': '320px',   // Extra small phones
				'xs': '375px',    // Small phones like iPhone SE
				'sm': '640px',    // Large phones
				'md': '768px',    // Tablets
				'lg': '1024px',   // Small laptops
				'xl': '1280px',   // Laptops
				'2xl': '1536px',  // Large screens
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
					red: 'hsl(0 84% 60%)',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground))'
				},
				wiggly: {
					50: 'hsl(var(--wiggly-50))',
					100: 'hsl(var(--wiggly-100))',
					200: 'hsl(var(--wiggly-200))',
					300: 'hsl(var(--wiggly-300))',
					400: 'hsl(var(--wiggly-400))',
					500: 'hsl(var(--wiggly-500))',
					600: 'hsl(var(--wiggly-600))',
					700: 'hsl(var(--wiggly-700))',
					800: 'hsl(var(--wiggly-800))',
					900: 'hsl(var(--wiggly-900))',
				},
                calendar: {
                    highlight: 'hsl(var(--primary))',
                    today: 'hsl(var(--accent))',
                    selected: 'hsl(var(--primary))',
                    hover: 'hsl(var(--primary) / 0.1)',
                    monthHeader: 'hsl(var(--primary) / 0.1)',
                    dayNames: 'hsl(var(--muted-foreground))',
                    buttonBg: 'hsl(var(--primary) / 0.1)'
                }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'glow': {
					'0%, 100%': { 
						boxShadow: '0 0 5px hsl(var(--primary) / 0.5)' 
					},
					'50%': { 
						boxShadow: '0 0 20px hsl(var(--primary) / 0.8)' 
					}
				},
                'float': {
                    '0%, 100%': { 
                        transform: 'translateY(0)' 
                    },
                    '50%': { 
                        transform: 'translateY(-5px)' 
                    }
                },
                'pulse-subtle': {
                    '0%, 100%': { 
                        opacity: 1,
                        transform: 'scale(1)'
                    },
                    '50%': { 
                        opacity: 0.95,
                        transform: 'scale(1.02)'
                    }
                },
                'scale-in': {
                    '0%': {
                        transform: 'scale(0.95)',
                        opacity: '0'
                    },
                    '100%': {
                        transform: 'scale(1)',
                        opacity: '1'
                    }
                },
                'slide-in-up': {
                    '0%': {
                        transform: 'translateY(100%)',
                        opacity: '0'
                    },
                    '100%': {
                        transform: 'translateY(0)',
                        opacity: '1'
                    }
                },
                'slide-in-left': {
                    '0%': {
                        transform: 'translateX(-100%)',
                        opacity: '0'
                    },
                    '100%': {
                        transform: 'translateX(0)',
                        opacity: '1'
                    }
                },
                'tooltip-entrance': {
                    '0%': {
                        opacity: '0',
                        transform: 'scale(0.95) translateY(4px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'scale(1) translateY(0)'
                    }
                },
                'tooltip-exit': {
                    '0%': {
                        opacity: '1',
                        transform: 'scale(1) translateY(0)'
                    },
                    '100%': {
                        opacity: '0',
                        transform: 'scale(0.95) translateY(4px)'
                    }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glow': 'glow 3s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
                'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
                'scale-in': 'scale-in 0.2s ease-out',
                'slide-in-up': 'slide-in-up 0.3s ease-out',
                'slide-in-left': 'slide-in-left 0.3s ease-out',
                'tooltip-in': 'tooltip-entrance 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                'tooltip-out': 'tooltip-exit 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
			},
            boxShadow: {
                'calendar': '0 4px 20px hsl(0 0% 0% / 0.1)',
                'day': '0 2px 5px hsl(var(--primary) / 0.2)',
                'mobile': '0 -4px 20px hsl(0 0% 0% / 0.1)', // Shadow for mobile bottom navigation
                'mobile-card': '0 2px 15px hsl(0 0% 0% / 0.08)' // Subtle shadow for mobile cards
            },
            fontSize: {
              'xxs': '0.625rem',  // 10px - Extra extra small text
              'xs': '0.75rem',    // 12px - Mobile optimized small text
              'sm': '0.875rem',   // 14px - Mobile body text
              'base': '1rem',     // 16px - Default mobile-friendly size
              'lg': '1.125rem',   // 18px - Mobile headings
              'xl': '1.25rem',    // 20px
              '2xl': '1.5rem',    // 24px
              '3xl': '1.875rem',  // 30px
              '4xl': '2.25rem',   // 36px
              '5xl': '3rem',      // 48px
            },
            spacing: {
              '0.25': '0.0625rem', // 1px
              '0.5': '0.125rem',   // 2px
              '1.5': '0.375rem',   // 6px
              '2.5': '0.625rem',   // 10px
              '3.5': '0.875rem',   // 14px
              '4.5': '1.125rem',   // 18px
              '5.5': '1.375rem',   // 22px
              '6.5': '1.625rem',   // 26px
              '15': '3.75rem',     // 60px - Better for mobile touch targets
              '18': '4.5rem',      // 72px
              '22': '5.5rem',      // 88px
              '26': '6.5rem',      // 104px
              '30': '7.5rem',      // 120px
              'safe-top': 'env(safe-area-inset-top)',
              'safe-bottom': 'env(safe-area-inset-bottom)',
              'safe-left': 'env(safe-area-inset-left)',
              'safe-right': 'env(safe-area-inset-right)',
            },
            minHeight: {
              'touch': '44px',     // Minimum touch target size
              'button': '48px',    // Comfortable button height
            },
            minWidth: {
              'touch': '44px',     // Minimum touch target size
              'button': '48px',    // Comfortable button width
            }
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		// Add safe area utilities
		function({ addUtilities }) {
			addUtilities({
				'.safe-area-top': {
					paddingTop: 'env(safe-area-inset-top)'
				},
				'.safe-area-bottom': {
					paddingBottom: 'env(safe-area-inset-bottom)'
				},
				'.safe-area-left': {
					paddingLeft: 'env(safe-area-inset-left)'
				},
				'.safe-area-right': {
					paddingRight: 'env(safe-area-inset-right)'
				},
				'.safe-area-x': {
					paddingLeft: 'env(safe-area-inset-left)',
					paddingRight: 'env(safe-area-inset-right)'
				},
				'.safe-area-y': {
					paddingTop: 'env(safe-area-inset-top)',
					paddingBottom: 'env(safe-area-inset-bottom)'
				},
				'.safe-area': {
					paddingTop: 'env(safe-area-inset-top)',
					paddingRight: 'env(safe-area-inset-right)',
					paddingBottom: 'env(safe-area-inset-bottom)',
					paddingLeft: 'env(safe-area-inset-left)'
				}
			})
		}
	],
} satisfies Config;
