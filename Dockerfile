FROM jekyll/jekyll:4.2.2

ENTRYPOINT [ "jekyll", "serve", "--watch", "--force-polling", "--drafts" ]