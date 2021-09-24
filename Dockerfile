FROM jekyll/jekyll:4.2.0

ENTRYPOINT [ "jekyll", "serve", "--watch", "--force-polling", "--drafts" ]