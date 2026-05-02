$c = Get-Content src/pages/Home.tsx -Raw
$c = $c -replace "Eligible Voters", "{t('eligible_voters')}"
$c = $c -replace "Lok Sabha Seats", "{t('lok_sabha_seats')}"
$c = $c -replace "Election Phases", "{t('phases')}"
$c = $c -replace "Your Vote Counts", "{t('your_vote_counts')}"
$c = $c -replace "DID YOU KNOW\?", "{t('did_you_know')}"
$c = $c -replace "India's Electoral Wonders", "{t('wonders')}"
$c = $c -replace "Frequently Asked Questions", "{t('faq_title')}"
Set-Content src/pages/Home.tsx $c
Write-Host "Done"
