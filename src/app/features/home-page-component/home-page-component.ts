import { Component, signal  } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

type CountryKey = 'de' | 'fi' | 'fr' | 'nl';

@Component({
  selector: 'app-home-page-component',
  imports: [RouterLink, CommonModule, TranslatePipe],
  templateUrl: './home-page-component.html',
  styleUrl: './home-page-component.scss',
})
export class HomePageComponent {
  countries = [
    {
      key: 'de' as CountryKey,
      name: 'Germany',
      blurb: `Want to work in Germany and start right away? You’re in the right place.
              We’ll match you with roles for a season, a year, or long-term contracts.
              With us, your start abroad is simpler—housing and onboarding support included.`,
      proof: `We’re among the fastest growing EU recruiters focused on the German market. 
              We’ve handled 92,000+ placement processes across logistics, production and technical roles. 
              Don’t wait—pick the right offer for you.`
    },
    {
      key: 'fi' as CountryKey,
      name: 'Finland',
      blurb: `Looking for stable work in Finland with reliable schedules and excellent work conditions?
              We’ll help you land roles fast—short projects or permanent contracts—plus relocation help.`,
      proof: `Thousands of completed placements across manufacturing, warehousing and food industry.
              Clear contracts, fair pay, and a support team that actually answers.`,
    },
    {
      key: 'fr' as CountryKey,
      name: 'France',
      blurb: `Thinking about France? From seasonal gigs to long-term jobs—we’ve got options across regions.
              We make paperwork and housing simple so you can focus on work from day one.`,
      proof: `Growing network of vetted French partners and transparent offers.
              Interview prep, contract checks and onboarding handled for you.`,
    },
    {
      key: 'nl' as CountryKey,
      name: 'Netherlands',
      blurb: `Are you looking for work in the Netherlands and want to start right away?
              Then you’ve come to the right place! Whether for a few months, years or indefinitely—
              with us, you get an easier start abroad.`,
      proof: `We are one of the fastest-growing temporary employment partners in Holland,
              specialising in recruiting Polish, Romanian and Slovakian nationals for the Dutch market.
              We’ve completed 92,000+ job processes—thousands moved closer to their goals.`
    },
  ];

  activeCountry = signal<CountryKey>('de');
  setCountry = (k: CountryKey) => this.activeCountry.set(k);
  steps = [1, 2, 3, 4];

  offersLinkByCountry: Record<CountryKey, string> = {
    de: '/jobs/germany',
    fi: '/jobs/finland',
    fr: '/jobs/france',
    nl: '/jobs/netherlands'
  };
}
