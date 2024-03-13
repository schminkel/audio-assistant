import logoNextJsLight from '@/images/tech/next-js/logo-light.svg'
import logoReactLight from '@/images/tech/react/logo-light.svg'
import logoVercelLight from '@/images/tech/vercel/logo-light.svg'
import logoAWSLight from '@/images/tech/aws/logo-light.svg'
import logoTypeScriptLight from '@/images/tech/typescript/logo-light.svg'
import logoChatGPTLight from '@/images/tech/chatgpt/logo-light.svg'
import Image from 'next/image'

export const TechWeUse = () => {
  return (
    <div>
      <p className="flex items-center justify-center font-display text-xl text-white">
        Technologien die wir einsetzen:
      </p>
      <ul className="mt-12 flex items-center justify-center gap-x-8 sm:flex-col sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0">
        {[
          [
            { name: 'Next.js', logo: logoNextJsLight },
            { name: 'React', logo: logoReactLight },
            { name: 'Vercel', logo: logoVercelLight },
          ],
          [
            { name: 'AWS', logo: logoAWSLight },
            { name: 'TypeScript', logo: logoTypeScriptLight },
            { name: 'ChatGPT', logo: logoChatGPTLight },
          ],
        ].map((group, groupIndex) => (
          <li key={groupIndex}>
            <ul className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0">
              {group.map((company) => (
                <li key={company.name} className="flex text-white">
                  <Image src={company.logo} alt={company.name} unoptimized />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
