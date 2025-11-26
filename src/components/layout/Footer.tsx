import { Github, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              互動式田口方法實驗設計工具
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              支援 L4、L8、L9、L16、L18、L27 直交表
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://zh.wikipedia.org/wiki/%E7%94%B0%E5%8F%A3%E6%96%B9%E6%B3%95"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>田口方法介紹</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>原始碼</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
