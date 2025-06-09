import Image from 'next/image';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import { ProjectDetail } from '@/lib/types';
import { getAllProjects, getProjectBySlug } from '@/lib/markdown';
import Link from 'next/link';
import { GetStaticProps, GetStaticPaths } from 'next';

interface ProjectPageProps {
  projectDetail: ProjectDetail;
}

// 生成所有可能的路径
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const projects = await getAllProjects();
    const paths = projects.map((project) => ({
      params: { slug: project.slug },
    }));

    return {
      paths,
      fallback: false
    };
  } catch (error) {
    console.error('生成项目路径失败:', error);
    return {
      paths: [],
      fallback: false
    };
  }
};

// 获取每个页面的具体数据
export const getStaticProps: GetStaticProps<ProjectPageProps, { slug: string }> = async ({ params }) => {
  if (!params?.slug) {
    return {
      notFound: true,
    };
  }

  try {
    const projectDetail = await getProjectBySlug(params.slug);
    if (!projectDetail) {
      return {
        notFound: true,
      };
    }
    
    return {
      props: {
        projectDetail,
      }
    };
  } catch (error) {
    console.error('获取项目详情失败:', error);
    return {
      notFound: true,
    };
  }
};

export default function ProjectDetailPage({ projectDetail }: ProjectPageProps) {
  if (!projectDetail) {
    notFound();
  }

  return (
    <PageLayout activePage="work" darkBg>
      <section className="pt-40 pb-20 px-6 lg:px-20">
        <Link 
          href="/work" 
          className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mr-2">
            <path d="M15.8334 10H4.16669" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.33331 5L3.33331 10L8.33331 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Portfolio
        </Link>
        <div className="max-w-[1440px] mx-auto">
          {/* 项目头部信息 */}
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-medium mb-4 theme-primary">
              {projectDetail.title}
            </h1>
            <p className="text-xl text-white/80 mb-8">
              {projectDetail.description}
            </p>
            <div className="flex flex-wrap gap-x-12 gap-y-4 text-white/60">
              {projectDetail.client && (
                <div>
                  <span className="block text-sm mb-1">Client</span>
                  <span className="text-white">{projectDetail.client}</span>
                </div>
              )}
              {projectDetail.role && (
                <div>
                  <span className="block text-sm mb-1">Role</span>
                  <span className="text-white">{projectDetail.role}</span>
                </div>
              )}
              <div>
                <span className="block text-sm mb-1">Year</span>
                <span className="text-white">{new Date(projectDetail.publishedAt).getFullYear()}</span>
              </div>
              <div>
                <span className="block text-sm mb-1">Category</span>
                <span className="text-white">{projectDetail.category}</span>
              </div>
            </div>
          </div>

          {/* 主图 */}
          <div className="relative aspect-video w-full mb-20 overflow-hidden">
            <Image
              src={projectDetail.mainImage}
              alt={projectDetail.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* 项目内容 */}
          <div className="max-w-3xl">
            {/* 技术栈 */}
            {projectDetail.technologies && projectDetail.technologies.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-medium mb-4 theme-primary">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {projectDetail.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-theme-gray text-white/80 text-sm rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </PageLayout>
  );
} 