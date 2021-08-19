const CACHE_NAME = 'STORIE_CACHE-v2'

function searchInCacheOrMakeRequest(request) {
    const catchPromise = caches.open(CACHE_NAME)
    const matchPromise = catchPromise
        .then(function(cache) {
            return cache.match(request)
        })
        // .catch(function(err) {

        // })
    
    return Promise.all([
            catchPromise,
            matchPromise
    ])
        .then(function([cache, cacheResponse]) {

            const fetchPromise = fetch(request)
                .then(function(fetchResponse) {
                    // Update cache
                    cache.put(request, fetchResponse.clone())
                    return fetchResponse
                })
            
            return cacheResponse || fetch

        })
}

self.addEventListener('install', function(){
    // save initial files

    caches.open(CACHE_NAME).then(function(cache) {
        cache.addAll(['/index.html', 'dist/js/bundle.js']);
    })
})

self.addEventListener('activate', function(event) {
    // Wait response and response with ...
    event.waitUltil(
        caches.keys().then(function(cachesKeys) {
            const promises = cachesKeys.map(cache => {
                if(cache != CACHE_NAME) return caches.delete(cache).then(FUNC)                
            })            
            return Promise.all(promises)
        })
    )
})

self.addEventListener('fetch', function(event) {
    // Wait response and response with ...
    event.respondWith(
        caches.match(event.request)
            .then(function(resp) {
                return resp || fetch(event.request)
                return searchInCacheOrMakeRequest(event.request)
            })
            .catch(function(err) {
                if(event.request.mode === 'navigate') {
                    return caches.match(event.request)
                }
            })
    )
})