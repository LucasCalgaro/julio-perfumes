import { Column } from "@/components/layout/column";
import { Row } from "@/components/layout/row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatters";
import { getProductBySlug } from "@/server-functions/products";
import { ExternalLink, ImageIcon, MessageSquareCheck } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produto não encontrado",
    };
  }

  return {
    title: `${product.name} | Júlio Perfumes`,
    description: `Compre ${product.name} da marca ${product.brand}.`,
    openGraph: {
      title: product.name,
      description: `Confira ${product.name} na nossa loja!`,
      images: product.imageUrl
        ? [
            {
              url: product.imageUrl,
              width: 800,
              height: 800,
              alt: product.name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductDetail({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Produto não encontrado.</p>
        <Link href="/">
          <Button variant="outline">Voltar ao catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-2 px-4" asChild>
          <Link href="/">&lt; Voltar</Link>
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/50 border border-accent">
            {product.imageUrl ? (
              <div className="w-full h-full relative">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <Row className="w-full h-full items-center justify-center text-muted-foreground/30">
                <ImageIcon className="w-16 h-16" />
              </Row>
            )}
          </div>

          <Column className="flex flex-col md:col-span-2">
            <Row className="justify-between items-center">
              <Column className="gap-0">
                <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
                  {product.name}
                  <span className="text-xs uppercase tracking-widest text-primary font-medium ml-4">
                    {product.brand}
                  </span>
                </h1>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{product.gender}</Badge>|
                  <Badge variant="outline">{product.category}</Badge>
                </div>

                {product.promoPriceInCents && (
                  <p className="font-heading text-2xl font-bold text-foreground line-through">
                    De: {formatPrice(product.priceInCents)}
                  </p>
                )}

                <p className="font-heading text-3xl font-bold text-foreground">
                  {product.promoPriceInCents && "Por: "}
                  {formatPrice(
                    product.promoPriceInCents ?? product.priceInCents,
                  )}
                </p>
              </Column>
              {product.brandUrl && (
                <Column className="relative overflow-hidden aspect-square w-20 rounded-lg border border-muted-foreground/10 bg-white">
                  <Image
                    src={product.brandUrl}
                    alt={product.brand}
                    className="scale-80 object-contain"
                    fill
                  />
                </Column>
              )}
            </Row>

            <Column className="mt-8 sm:justify-end sm:flex-row">
              {product.fragranticaUrl && (
                <Button
                  variant="secondary"
                  className="gap-2 border border-foreground"
                  asChild
                >
                  <Link
                    href={product.fragranticaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver no Fragrantica
                  </Link>
                </Button>
              )}
              <Button
                variant="default"
                className="gap-2 bg-green-600 hover:bg-green-700"
                asChild
              >
                <Link
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=Ol%C3%A1,%20gostaria%20de%20comprar%20o%20produto%20"${product.name}"%0A${process.env.NEXT_PUBLIC_BASE_URL}/produto/${product.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquareCheck className="size-5" />
                  Comprar Agora
                </Link>
              </Button>
            </Column>
          </Column>
        </div>
      </div>
    </div>
  );
}
