<script>
    import { fade, fly } from 'svelte/transition';
    // Our services
    const services = [
        {
            id: 'saas-development',
            title: 'SaaS Development',
            description: 'We build scalable, user-friendly software-as-a-service solutions tailored to your business needs.',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>`,
            illustration: "https://ik.imagekit.io/softodesign/illustrations/saas-illustration.svg"
        },
        {
            id: 'agency-services',
            title: 'Agency Services',
            description: 'From design to marketing, our agency services help businesses establish and grow their digital presence.',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`,
            illustration: "https://ik.imagekit.io/softodesign/illustrations/agency-illustration.svg"
        },
        {
            id: 'custom-solutions',
            title: 'Custom Solutions',
            description: 'We develop bespoke software solutions that address your specific business challenges and requirements.',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>`,
            illustration: "https://ik.imagekit.io/softodesign/illustrations/custom-solution.svg"
        },
        {
            id: 'tech-creation',
            title: 'Tech Creation',
            description: 'We innovate and build cutting-edge technology products that solve real-world problems.',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`,
            illustration: "https://ik.imagekit.io/softodesign/illustrations/tech-creation.svg"
        }
    ];
</script>

<!-- What We Do Section -->
<section class="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute top-0 left-0 w-full h-64 bg-purple-50 opacity-50 -skew-y-6 transform -translate-y-32"></div>
    <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full opacity-30 transform translate-x-1/4 -translate-y-1/4"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-50 rounded-full opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>
    
    <div class="container-custom relative z-10">
        <div class="text-center mb-16" in:fade={{ duration: 500, delay: 200 }}>
            <span class="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">Our Expertise</span>
            <h2 class="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700">What We Do</h2>
            <div class="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
            <p class="text-xl text-gray-700 max-w-3xl mx-auto">
                At SoftoDesign, we transform ideas into digital reality. Our expertise spans across various domains of technology and design.
            </p>
        </div>
        
        <!-- 2x2 Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {#each services as service, i}
                <div 
                    class="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col transform hover:-translate-y-2 relative overflow-hidden"
                    in:fly={{ y: 30, duration: 600, delay: 300 + (i * 150) }}
                >
                    <!-- Service card header with illustration -->
                    <div class="relative h-48 bg-gradient-to-r from-purple-50 to-indigo-50 overflow-hidden">
                        <!-- Animated background pattern -->
                        <div class="absolute inset-0 bg-pattern opacity-10"></div>
                        
                        <!-- Illustration placeholder - replace with actual illustrations -->
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-32 h-32 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                                <div class="text-purple-700 transform group-hover:rotate-12 transition-transform duration-700">
                                    {@html service.icon}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Service category badge -->
                        <div class="absolute top-4 left-4">
                            <span class="inline-block px-3 py-1 bg-white/80 backdrop-blur-sm text-purple-700 text-xs font-medium rounded-full">
                                Service {i + 1}
                            </span>
                        </div>
                    </div>
                    
                    <!-- Service content -->
                    <div class="p-8 flex-grow flex flex-col">
                        <h3 class="text-2xl font-bold mb-4 group-hover:text-purple-700 transition-colors">{service.title}</h3>
                        <p class="text-gray-600 mb-6 flex-grow">{service.description}</p>
                        
                        <!-- Action link -->
                        <div class="mt-auto pt-4 border-t border-gray-100">
                            <a 
                                href="/products#{service.id}" 
                                class="text-purple-700 font-medium hover:text-purple-900 inline-flex items-center group/link"
                            >
                                <span>Learn more</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1 transform group-hover/link:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
        
        <!-- Call to action button -->
        <div class="mt-16 text-center" in:fade={{ duration: 500, delay: 1000 }}>
            <a 
                href="/products" 
                class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
                View All Services
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </a>
        </div>
    </div>
</section>

<style>
    .bg-pattern {
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
</style>


