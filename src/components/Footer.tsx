import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Organization Partners */}
        <div className="mb-8">
          <h3 className="text-center text-lg font-semibold text-foreground mb-6">
            Parteneri și Organizatori
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
            <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-lg p-2 shadow-sm">
              <Image
                src="/orgs/1.png"
                alt="Organizator 1"
                width={80}
                height={80}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-lg p-2 shadow-sm">
              <Image
                src="/orgs/2.png"
                alt="Organizator 2"
                width={80}
                height={80}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-lg p-2 shadow-sm">
              <Image
                src="/orgs/3.png"
                alt="Organizator 3"
                width={80}
                height={80}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-lg p-2 shadow-sm">
              <Image
                src="/orgs/4.png"
                alt="Organizator 4"
                width={80}
                height={80}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-lg p-2 shadow-sm">
              <Image
                src="/orgs/5.png"
                alt="Organizator 5"
                width={80}
                height={80}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-lg p-2 shadow-sm">
              <Image
                src="/orgs/6.jpeg"
                alt="Organizator 6"
                width={80}
                height={80}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground border-t border-border pt-6">
          <p className="mb-2">
            &copy; {new Date().getFullYear()} MIMESISS. Toate drepturile rezervate.
          </p>
          <p className="text-xs">
            Dezvoltat de <a target='_blank' className='text-primary underline' href="https://fldr.xyz">Ursan Bogdan</a>
          </p>
        </div>
      </div>
    </footer>
  )
}